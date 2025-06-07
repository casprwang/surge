'use strict' 

const compile = require('@adguard/hostlist-compiler')
const { join } = require('path')
const fs = require('fs-extra')
const slugify = require('@sindresorhus/slugify')
const { exec } = require('child_process')
const { promisify } = require('util')

const execAsync = promisify(exec)

const remoteFiles = [
  'https://ruleset.skk.moe/List/domainset/reject.conf',
  'https://ruleset.skk.moe/List/domainset/reject_extra.conf',
  'https://raw.githubusercontent.com/privacy-protection-tools/anti-AD/master/anti-ad-surge2.txt',
]

async function downloadAndCleanRemoteFiles() {
  console.log('📥 Downloading remote files...')
  
  await Promise.all(remoteFiles.map(async (url) => {
    try {
      // Generate filename from URL
      const filename = url.split('/').pop() || `remote-${Date.now()}.txt`
      const tempPath = join(distDir, `temp-${filename}`)
      const finalPath = join(distDir, filename)
      
      // Download file using curl
      const downloadCommand = `curl -s -L "${url}" -o "${tempPath}"`
      await execAsync(downloadCommand)
      
      // Clean file: remove empty lines and lines starting with #
      const cleanCommand = `grep -v '^#\\|^$' "${tempPath}" > "${finalPath}" && rm "${tempPath}"`
      await execAsync(cleanCommand)
      
      console.log(`✅ Downloaded and cleaned: ${filename}`)
    } catch (error) {
      console.error(`❌ Error processing ${url}:`, error.message)
    }
  }))
}



const distDir = join(__dirname, './domain-set')
const configurations = [
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
        source: 'https://big.oisd.nl',
      },
    ],
    transformations: ['RemoveComments', 'RemoveModifiers', 'Validate', 'Deduplicate'],
  },
]

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

  for (const rule of compiled) {
    const formatted = formatRule(rule)

    if (formatted) {
      if (formatted.includes('*')) {
        console.warn('⚠️', formatted, 'is skipped because it contains *')
        continue
      }

      stream.write(formatted + '\n')
    }
  }

  stream.end()
}

// function to read all lines from all files of ./domain-set
// remove duplicated lines
// and save the result to ./domain-set/all.txt (in the same format as the other files)

async function generateNonDuplicatedAll() {
  // Use shell commands to concatenate all .txt files, sort and remove duplicates
  const command = `cat "${distDir}"/*.txt | sort -u > "${distDir}/all.txt"`
  
  try {
    await execAsync(command)
    console.log('✅ Generated all.txt with unique domains')
  } catch (error) {
    console.error('❌ Error generating all.txt:', error.message)
    throw error
  }
}


async function main() {
  // remove all files in ./domain-set first 
  await fs.remove(distDir)
  await fs.ensureDir(distDir)
  
  // Download and clean remote files
  await downloadAndCleanRemoteFiles()
  
  // Process configurations
  await Promise.all(
    configurations.map(async (config) => {
      const compiled = await compile(config)
      await outputCompiled(config, compiled)
    })
  )
  
  // Generate consolidated file
  await generateNonDuplicatedAll()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
