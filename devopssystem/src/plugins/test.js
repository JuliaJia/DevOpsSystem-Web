function testPromise () {
  return new Promise(
    (resolve, reject) => {
      setTimeout(() => {
        // eslint-disable-next-line prefer-promise-reject-errors
        resolve({ code: 1000, message: 'ok' })
      }, 5000)
    }
  )
}

async function test () {
  const t = await testPromise()
  console.log(t)
  return t
}

const a = test()

setTimeout(() => {
  console.log(a)
  a.then((value) => {
    console.log(typeof value, value)
  }).catch((reason) => {
    console.log(typeof reason, reason)
  })
}, 6000)
