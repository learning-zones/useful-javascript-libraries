const dayjs = require('dayjs')
const { readFile } = require('fs-extra')
const { resolve } = require('path')
const { trim, remove } = require('rambdax')
const { writeFileSync } = require('fs')

const today = dayjs().format('YYYY-MM-DD')
const GITHUB_MARKER = 'https://github.com/'

async function bookmarksToLinks(destinationFilePath){
    const sourcePath = resolve(__dirname, `../../bookmarks-${ today }.json`)
    const asText = await readFile(sourcePath)

    const githubRepos = asText
      .toString()
      .match(/\"uri\":\s\".+(?=\")/g)
      .filter(x => !x.includes('selfrefactor') && x.includes(GITHUB_MARKER))
      .map(remove([ 'uri', ':', /\"/g ]))
      .map(trim)
      .filter(x => !x.includes('trending') && x.split('/').length === 5)
      .join('\n')
  
    writeFileSync(destinationFilePath, githubRepos)
  
    return githubRepos
}

exports.bookmarksToLinks = bookmarksToLinks
