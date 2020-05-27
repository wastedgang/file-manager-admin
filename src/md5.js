import SparkMD5 from 'spark-md5'

export default ({ file, onProgress }) => {
    return new Promise((resolve, reject) => {
        var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
            chunkSize = 2097152,                             // Read in chunks of 2MB
            chunks = Math.ceil(file.size / chunkSize),
            currentChunk = 0,
            spark = new SparkMD5.ArrayBuffer(),
            fileReader = new FileReader()
        if (onProgress) {
            onProgress({ total: chunks, current: currentChunk })
        }

        fileReader.onload = function (e) {
            spark.append(e.target.result)                   // Append array buffer
            currentChunk++
            if (onProgress) {
                onProgress({ total: chunks, current: currentChunk + 1 })
            }

            if (currentChunk < chunks) {
                loadNext()
            } else {
                resolve(spark.end())
            }
        }

        fileReader.onerror = function (err) {
            reject(err)
        }

        function loadNext() {
            var start = currentChunk * chunkSize,
                end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;

            fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
        }

        loadNext()
    })
}