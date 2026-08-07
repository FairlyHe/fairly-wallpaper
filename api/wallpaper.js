const UPSTREAM_URL = 'http://cdn.apc.360.cn/index.php'
const ALLOWED_PARAMS = new Set(['c', 'a', 'cid', 'start', 'count'])

export default async function handler(request, response) {
    if (request.method !== 'GET') {
        response.setHeader('Allow', 'GET')
        return response.status(405).json({message: 'Method not allowed'})
    }

    const upstreamUrl = new URL(UPSTREAM_URL)
    for (const [key, value] of Object.entries(request.query)) {
        if (!ALLOWED_PARAMS.has(key) || Array.isArray(value)) continue
        upstreamUrl.searchParams.set(key, value)
    }

    try {
        const upstreamResponse = await fetch(upstreamUrl, {
            headers: {
                accept: 'application/json,text/plain,*/*',
                referer: 'http://cdn.apc.360.cn/',
                'user-agent': 'Mozilla/5.0 (compatible; FairlyWallpaper/1.0)'
            }
        })
        const body = await upstreamResponse.text()

        response.setHeader(
            'Cache-Control',
            'public, s-maxage=300, stale-while-revalidate=3600'
        )
        response.setHeader(
            'Content-Type',
            upstreamResponse.headers.get('content-type') || 'application/json; charset=utf-8'
        )
        return response.status(upstreamResponse.status).send(body)
    } catch (error) {
        return response.status(502).json({message: 'Wallpaper service is unavailable'})
    }
}
