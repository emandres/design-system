// @flow
import type {
  GHContent,
  GHReposGetContentRes,
  GHApi,
  GHHttpConfig,
  GHReposGetContentConfig
} from './types'

import config from './config'

type Dependencies = {
  [name: string]: string
}
type PackageJson = {
  dependencies: Dependencies
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
const maxAttempts = 5
export const getForRepo = async (
  config: GHReposGetContentConfig,
  github: GHApi,
  attempts: number = 0
): Promise<GHContent[]> => {
  if (attempts >= maxAttempts)
    throw new Error(`Too many content request retries in repo ${config.repo}`)
  try {
    const res = await github.repos.getContent(config)
    return Array.isArray(res.data) ? res.data : [res.data]
  } catch (err) {
    if (err.code === 404) {
      // console.log('No specified content in repo', config.repo, config.path)
      return []
    } else if (err.code === 403 && err.headers['retry-after']) {
      const retryMs = parseInt(err.headers['retry-after'] || 0, 10) * 1000
      if (retryMs < 5000) {
        // console.log(
        //   'rate limit. retrying after delay (ms)',
        //   config.repo,
        //   retryMs
        // )
        await wait(retryMs)
        return await getForRepo(config, github, attempts + 1)
      } else {
        console.log(
          'rate limit. retry time too long (ms)',
          config.repo,
          retryMs
        )
        return []
      }
    }
    console.log('didnt work, even with retries', config.repo, err)
    return []
  }
}

export const readJson = async (
  config: GHHttpConfig,
  dep: GHContent
): Promise<?PackageJson> => {
  let res
  try {
    res = await fetch(dep.download_url, {
      Authorization: `token ${config.token}`
    })
  } catch (err) {
    console.log('failure to fetch file', err)
    return null
  }

  try {
    const json = await res.json()
    return json
  } catch (err) {
    console.log('failure to parse json', err)
    return null
  }
}

export const filterDesignSystem = (pkgJson: PackageJson): Dependencies =>
  Object.keys(pkgJson.dependencies || {})
    .filter(name => /@pluralsight\/ps-design-system-/.test(name))
    .reduce((acc, name) => {
      acc[name] = pkgJson.dependencies[name]
      return acc
    }, {})

export const getDesignSystemDeps = async (
  dependency: GHContent
): Promise<?Dependencies> => {
  const json = await readJson({ token: config.githubToken }, dependency)
  if (json) {
    const designSystemPackages = filterDesignSystem(json)
    return Object.keys(designSystemPackages).length > 0
      ? designSystemPackages
      : null
  }
}
