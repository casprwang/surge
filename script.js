import pRetry from 'p-retry'
import compile from '@adguard/hostlist-compiler'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
import fs from 'fs-extra'
import slugify from '@sindresorhus/slugify'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

const remoteFiles = [
  'https://ruleset.skk.moe/List/domainset/reject.conf',
  'https://ruleset.skk.moe/List/domainset/reject_extra.conf',
  'https://raw.githubusercontent.com/privacy-protection-tools/anti-AD/master/anti-ad-surge2.txt',
]

async function downloadAndCleanRemoteFiles() {
  console.log('📥 Downloading remote files...')

  await Promise.all(
    remoteFiles.map(async (url) => {
      try {
        // Generate filename from URL
        const filename = url.split('/').pop() || `remote-${Date.now()}.txt`
        const tempPath = join(distDir, `temp-${filename}`)
        const finalPath = join(distDir, filename)

        // Download file using curl
        const downloadCommand = `curl -s -L "${url}" -o "${tempPath}"`
        await pRetry(() => execAsync(downloadCommand), { retries: 5 })

        // Clean file: remove empty lines and lines starting with #
        const cleanCommand = `grep -v '^#\\|^$' "${tempPath}" > "${finalPath}" && rm "${tempPath}"`
        await execAsync(cleanCommand)

        console.log(`✅ Downloaded and cleaned: ${filename}`)
      } catch (error) {
        console.error(`❌ Error processing ${url}:`, error.message)
      }
    })
  )
}

const distDir = join(__dirname, './domain-set')
const configurations =
  /** @type {import('@adguard/hostlist-compiler').IConfiguration[]} */ ([
    {
      name: 'Hagezi Pro Plus',
      homepage: 'https://github.com/hagezi/dns-blocklists',
      sources: [
        {
          source:
            'https://raw.githubusercontent.com/hagezi/dns-blocklists/main/hosts/pro.plus.txt',
          type: 'hosts',
        },
      ],
      transformations: [
        'RemoveComments',
        'RemoveModifiers',
        'Compress',
        'Validate',
        'Deduplicate',
      ],
    },
    {
      name: 'Hagezi Pro',
      homepage: 'https://github.com/hagezi/dns-blocklists?tab=readme-ov-file#pro',
      sources: [
        {
          source:
            'https://raw.githubusercontent.com/hagezi/dns-blocklists/main/hosts/pro.txt',
          type: 'hosts',
        },
      ],
      transformations: [
        'RemoveComments',
        'RemoveModifiers',
        'Compress',
        'Validate',
        'Deduplicate',
      ],
    },
    {
      name: 'StevenBlack',
      homepage: 'https://github.com/StevenBlack/hosts?tab=readme-ov-file',
      sources: [
        {
          source: 'https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts',
          type: 'hosts',
        },
      ],
      transformations: [
        'RemoveComments',
        'RemoveModifiers',
        'Compress',
        'Validate',
        'Deduplicate',
      ],
    },
    {
      name: 'OISD Big',
      sources: [
        {
          source:
            'https://raw.githubusercontent.com/sjhgvr/oisd/refs/heads/main/abp_big.txt',
        },
      ],
      transformations: ['RemoveComments', 'RemoveModifiers', 'Validate', 'Deduplicate'],
    },
  ])

function formatRule(rule) {
  const reg = /^\|\|(.*)\^$/

  if (!reg.test(rule)) {
    return
  }

  const domain = rule.match(reg)[1]

  return '.' + domain
}

async function outputCompiled(config, compiled) {
  const fileName = `${slugify(config.name)}.txt`
  const dest = join(distDir, fileName)

  if (fs.existsSync(dest)) {
    await fs.remove(dest)
  }

  const stream = fs.createWriteStream(dest)
  let processedCount = 0

  // Handle both array and string formats from the compiler
  const rules = Array.isArray(compiled) ? compiled : compiled.split('\n')

  for (const rule of rules) {
    const cleanRule = typeof rule === 'string' ? rule.trim() : String(rule).trim()
    const formatted = formatRule(cleanRule)

    if (formatted) {
      if (formatted.includes('*')) {
        console.warn('⚠️', formatted, 'is skipped because it contains *')
        continue
      }

      stream.write(formatted + '\n')
      processedCount++
    }
  }

  stream.end()

  console.log(
    `✅ Generated ${fileName} with ${processedCount.toLocaleString()} rules from ${rules.length.toLocaleString()} total entries`
  )
}

// function to read all lines from all files of ./domain-set
// remove duplicated lines
// and save the result to ./domain-set/all.txt (in the same format as the other files)

async function updateReadmeWithStats(lineCount) {
  try {
    const readmePath = join(__dirname, 'README.md')
    let content = await fs.readFile(readmePath, 'utf8')

    // Update the last updated timestamp at the top of the file
    const now = new Date().toISOString().split('T')[0] // YYYY-MM-DD format
    content = content.replace(
      /(\*\*Last\*\*: ).*(\n)/,
      `$1${now} (${lineCount.toLocaleString()})$2`
    )

    await fs.writeFile(readmePath, content)
    console.log('✅ Updated README with current statistics')
  } catch (error) {
    console.error('❌ Error updating README:', error.message)
  }
}

async function generateNonDuplicatedAll() {
  // Use shell commands to concatenate all .txt files, sort and remove duplicates
  console.log('📝 Generating consolidated full.txt file...')

  // First, let's see what files we have
  const listFilesCommand = `ls -la "${distDir}"/*.txt`
  try {
    const { stdout: fileList } = await execAsync(listFilesCommand)
    console.log('Files to process:')
    console.log(fileList)
  } catch (error) {
    console.log('No .txt files found or error listing files:', error.message)
  }

  const command = `cat "${distDir}"/*.txt | sort -u > "${distDir}/full.txt"`

  try {
    await execAsync(command)

    // Count lines in full.txt
    const countCommand = `wc -l < "${distDir}/full.txt"`
    const { stdout } = await execAsync(countCommand)
    const lineCount = parseInt(stdout.trim())

    console.log(`✅ Generated full.txt with ${lineCount.toLocaleString()} unique domains`)

    // Also count total lines before deduplication for comparison
    const totalLinesCommand = `cat "${distDir}"/*.txt | wc -l`
    try {
      const { stdout: totalLines } = await execAsync(totalLinesCommand)
      const totalCount = parseInt(totalLines.trim())
      const duplicatesRemoved = totalCount - lineCount
      console.log(`📊 Total lines before deduplication: ${totalCount.toLocaleString()}`)
      console.log(`📊 Duplicates removed: ${duplicatesRemoved.toLocaleString()}`)
    } catch (error) {
      console.log('Could not count total lines:', error.message)
    }

    // Update README with the line count
    await updateReadmeWithStats(lineCount)
  } catch (error) {
    console.error('❌ Error generating full.txt:', error.message)
    throw error
  }
}

async function main() {
  console.log('🚀 Starting domain blocklist compilation...')

  // remove all files in ./domain-set first
  console.log('🧹 Cleaning existing domain-set directory...')
  await fs.remove(distDir)
  await fs.ensureDir(distDir)

  // Download and clean remote files
  console.log('📥 Downloading and cleaning remote files...')
  await downloadAndCleanRemoteFiles()

  // Process configurations
  console.log('📝 Processing blocklist configurations...')
  await Promise.all(
    configurations.map(async (config, index) => {
      console.log(`[${index + 1}/${configurations.length}] Processing ${config.name}...`)
      try {
        const compiled = await compile(config)
        await outputCompiled(config, compiled)
        console.log(`✅ Completed ${config.name}`)
      } catch (error) {
        console.error(`❌ Failed to process ${config.name}:`, error.message)
        throw error // Re-throw to stop execution
      }
    })
  )

  console.log('🔗 All individual blocklists processed successfully!')

  // Generate consolidated file
  console.log('📊 Generating consolidated file...')

  // download 1hosts pro wildcards
  await download1Hosts()

  await generateNonDuplicatedAll()

  console.log('🎉 All blocklists processed and consolidated!')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

async function download1Hosts() {
  console.log('📥 Downloading 1Hosts Pro wildcards...')

  try {
    const url = 'https://cdn.jsdelivr.net/gh/badmojr/1Hosts@master/Pro/wildcards.txt'
    const filename = '1hosts-pro-wildcards.txt'
    const tempPath = join(distDir, `temp-${filename}`)
    const finalPath = join(distDir, filename)

    // Download file using curl
    const downloadCommand = `curl -s -L "${url}" -o "${tempPath}"`
    await pRetry(() => execAsync(downloadCommand), { retries: 5 })

    // Clean file: remove comments, empty lines, and process wildcard entries
    const cleanCommand = `grep -v '^#\\|^$' "${tempPath}" | sed 's/^\\*//' > "${finalPath}" && rm "${tempPath}"`
    await execAsync(cleanCommand)

    console.log(`✅ Downloaded and cleaned: ${filename}`)
  } catch (error) {
    console.error(`❌ Error processing 1Hosts:`, error.message)
    throw error
  }
}
