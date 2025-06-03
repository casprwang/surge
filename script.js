'use strict'

const compile = require('@adguard/hostlist-compiler')
const { join } = require('path')
const fs = require('fs-extra')
const slugify = require('@sindresorhus/slugify')

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

async function main() {
  await fs.ensureDir(distDir)
  for (const config of configurations) {
    const compiled = await compile(config)
    await outputCompiled(config, compiled)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
