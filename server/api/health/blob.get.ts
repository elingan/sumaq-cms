import { blob } from 'hub:blob'

export default defineEventHandler(async () => {
    const testKey = 'health-check/test.txt'
    const testContent = `Health check at ${new Date().toISOString()}`

    try {
        // Test write operation
        const writeResult = await blob.put(testKey, testContent, {
            contentType: 'text/plain'
        })

        // Test read operation
        const readResult = await blob.get(testKey)
        const content = await readResult?.text()

        // Test delete operation
        await blob.del(testKey)

        // Verify the content matches
        const isValid = content === testContent

        // Get environment info
        const isDev = process.env.NODE_ENV === 'development'
        const hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN

        return {
            status: 'ok',
            message: 'Blob storage connection successful',
            environment: isDev ? 'development' : 'production',
            driver: isDev && !hasBlobToken ? 'fs' : hasBlobToken ? 'vercel-blob' : 'unknown',
            operations: {
                write: !!writeResult,
                read: !!content,
                delete: true,
                contentMatch: isValid
            },
            timestamp: new Date().toISOString()
        }
    } catch (error) {
        return {
            status: 'error',
            message: 'Blob storage operation failed',
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
        }
    }
})
