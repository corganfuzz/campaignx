import type { BriefFormData } from '../types'

export function parseBriefText(text: string): Partial<BriefFormData> {
    let parsed: Partial<BriefFormData> = {}

    if (text.trim().startsWith('{')) {
        try {
            parsed = JSON.parse(text)
        } catch { }
    } else {
        const lines = text.split('\n')
        let currentKey = ''
        const result: Record<string, any> = {}

        lines.forEach(line => {
            const trimmed = line.trim()
            if (!trimmed || trimmed.startsWith('---')) return

            if (trimmed.startsWith('-')) {
                const listVal = trimmed.replace(/^-/, '').trim()
                if (currentKey) {
                    if (!result[currentKey]) {
                        result[currentKey] = []
                    } else if (!Array.isArray(result[currentKey])) {
                        result[currentKey] = [result[currentKey]]
                    }
                    result[currentKey].push(listVal)
                }
            } else if (trimmed.includes(':')) {
                const [k, ...vParts] = trimmed.split(':')
                currentKey = k.trim()
                const val = vParts.join(':').trim()
                if (val) {
                    result[currentKey] = val
                } else {
                    result[currentKey] = []
                }
            }
        })
        parsed = result as Partial<BriefFormData>
    }
    return parsed
}
