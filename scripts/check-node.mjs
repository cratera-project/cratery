const REQUIRED_MAJOR = Number(process.env.npm_package_engines_node?.match(/>=(\d+)/)?.[1] ?? 22)
const major = Number(process.versions.node.split('.')[0])

if (major < REQUIRED_MAJOR) {
  console.error(
    `cratery requires Node.js ${REQUIRED_MAJOR}+ but you are running ${process.versions.node}. ` +
      `Install it with nvm: nvm install ${REQUIRED_MAJOR} && nvm use ${REQUIRED_MAJOR}`,
  )
  process.exit(1)
}
