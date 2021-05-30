module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next)
    }
}
//use it to wrap our async function