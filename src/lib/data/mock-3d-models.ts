// Mock 3D Assembly Model Data
// Maps assembly parts to Three.js primitive geometries

export interface AssemblyPart {
    id: string
    name: string
    stepTitle: string // Maps to JobStep.title for matching
    geometry: 'box' | 'cylinder' | 'sphere'
    position: [number, number, number]
    rotation: [number, number, number]
    scale: [number, number, number]
    color: string
    highlightColor: string
    completedColor: string
    description: string
    instructions: string[]
    order: number
    explodedOffset: [number, number, number] // Offset for exploded view
}

export interface AssemblyModel {
    id: string
    name: string
    description: string
    category: string
    parts: AssemblyPart[]
}

// Default mock model: Wall-type AC Unit (Duvar Tipi Klima)
export const MOCK_AC_UNIT_MODEL: AssemblyModel = {
    id: 'ac-wall-unit',
    name: 'Duvar Tipi Klima Ünitesi',
    description: 'Split klima sistemi - iç ve dış ünite montajı',
    category: 'HVAC',
    parts: [
        {
            id: 'mounting-plate',
            name: 'Montaj Sacı',
            stepTitle: 'Montaj sacının sabitlenmesi',
            geometry: 'box',
            position: [0, 2.5, -0.5],
            rotation: [0, 0, 0],
            scale: [3, 0.1, 0.8],
            color: '#94a3b8',
            highlightColor: '#3b82f6',
            completedColor: '#22c55e',
            description: 'Duvar montaj sacını su terazisiyle hizalayarak sabitleyin.',
            instructions: [
                'Montaj sacını duvara tutun ve su terazisi ile hizalayın',
                'İşaretleme noktalarını belirleyin',
                'Dübel delikleri açın (8mm matkap ucu)',
                'Sacı 4 adet M8 dübel ile sabitleyin',
                'Hizalamayı tekrar kontrol edin'
            ],
            order: 1,
            explodedOffset: [0, 1.5, -2]
        },
        {
            id: 'indoor-unit-body',
            name: 'İç Ünite Gövdesi',
            stepTitle: 'İç ünite montajı',
            geometry: 'box',
            position: [0, 2.5, 0],
            rotation: [0, 0, 0],
            scale: [3.2, 0.9, 0.7],
            color: '#f8fafc',
            highlightColor: '#3b82f6',
            completedColor: '#22c55e',
            description: 'İç üniteyi montaj sacına takın ve kilitleyin.',
            instructions: [
                'İç üniteyi montaj sacına üst kısmından asın',
                'Alt kilitlemeli tırnakları yerine oturtun',
                'Üniteyi hafifçe çekerek sabitlendiğini kontrol edin',
                'Drenaj hortumunu bağlayın',
                'Elektrik bağlantısını yapın'
            ],
            order: 2,
            explodedOffset: [0, 1.5, 2]
        },
        {
            id: 'indoor-filter',
            name: 'İç Ünite Filtresi',
            stepTitle: 'Filtrelerin takılması',
            geometry: 'box',
            position: [0, 2.35, 0.3],
            rotation: [0.15, 0, 0],
            scale: [2.8, 0.05, 0.5],
            color: '#e2e8f0',
            highlightColor: '#3b82f6',
            completedColor: '#22c55e',
            description: 'Hava filtrelerini iç üniteye takın.',
            instructions: [
                'Ön kapağı açın',
                'Filtreleri ray boyunca kaydırarak yerleştirin',
                'Filtrelerin tam oturduğundan emin olun',
                'Ön kapağı kapatın'
            ],
            order: 3,
            explodedOffset: [0, 0, 3]
        },
        {
            id: 'copper-pipe',
            name: 'Bakır Boru Hattı',
            stepTitle: 'Boru bağlantıları',
            geometry: 'cylinder',
            position: [1.8, 1.2, 0],
            rotation: [0, 0, Math.PI / 4],
            scale: [0.08, 2.5, 0.08],
            color: '#d97706',
            highlightColor: '#3b82f6',
            completedColor: '#22c55e',
            description: 'Bakır boruları iç ve dış ünite arasında bağlayın.',
            instructions: [
                'Duvar deliğinden bakır boruları geçirin',
                'İç ünite bağlantı noktalarına takın',
                'Flare somunlarını tork anahtarı ile sıkın',
                'Dış ünite bağlantı noktalarına takın',
                'Vakum pompası ile sistemi vakumlayın (15 dk)',
                'Kaçak testi yapın (azot basıncı)'
            ],
            order: 4,
            explodedOffset: [3, 0, 0]
        },
        {
            id: 'outdoor-unit',
            name: 'Dış Ünite',
            stepTitle: 'Dış ünite montajı',
            geometry: 'box',
            position: [0, -1.5, 0],
            rotation: [0, 0, 0],
            scale: [2.5, 2, 1.2],
            color: '#cbd5e1',
            highlightColor: '#3b82f6',
            completedColor: '#22c55e',
            description: 'Dış üniteyi konsola monte edin ve bağlantıları yapın.',
            instructions: [
                'Dış ünite konsolunu duvara sabitleyin',
                'Dış üniteyi konsola yerleştirin',
                'Titreşim padlerini takın',
                'Bakır boru bağlantılarını yapın',
                'Elektrik kablolarını bağlayın',
                'Drenaj hortumunu yönlendirin'
            ],
            order: 5,
            explodedOffset: [0, -3, 0]
        },
        {
            id: 'outdoor-fan',
            name: 'Dış Ünite Fanı',
            stepTitle: 'Fan kontrolü',
            geometry: 'cylinder',
            position: [0, -1.5, 0.65],
            rotation: [Math.PI / 2, 0, 0],
            scale: [0.7, 0.1, 0.7],
            color: '#64748b',
            highlightColor: '#3b82f6',
            completedColor: '#22c55e',
            description: 'Fan motorunun doğru çalıştığını kontrol edin.',
            instructions: [
                'Fan pervanelerinin hasarsız olduğunu kontrol edin',
                'Motor bağlantı kablolarını kontrol edin',
                'Manuel döndürerek takılma olmadığını doğrulayın',
                'Sistemi çalıştırıp fan dönüşünü kontrol edin'
            ],
            order: 6,
            explodedOffset: [0, 0, 3]
        },
        {
            id: 'electrical-cable',
            name: 'Elektrik Kablosu',
            stepTitle: 'Elektrik bağlantısı',
            geometry: 'cylinder',
            position: [-1.5, 0.5, 0],
            rotation: [0, 0, 0],
            scale: [0.05, 3.5, 0.05],
            color: '#1e293b',
            highlightColor: '#3b82f6',
            completedColor: '#22c55e',
            description: 'Elektrik kablolarını bağlayın ve test edin.',
            instructions: [
                'Ana sigortayı kapatın',
                'Kablo kanalını duvar boyunca döşeyin',
                'İç ve dış ünite elektrik bağlantılarını yapın',
                'Topraklama kablosunu bağlayın',
                'Sigortayı açarak voltaj kontrolü yapın'
            ],
            order: 7,
            explodedOffset: [-3, 0, 0]
        },
        {
            id: 'test-run',
            name: 'Test Çalıştırması',
            stepTitle: 'Test ve devreye alma',
            geometry: 'sphere',
            position: [0, 0.5, 2],
            rotation: [0, 0, 0],
            scale: [0.4, 0.4, 0.4],
            color: '#fbbf24',
            highlightColor: '#3b82f6',
            completedColor: '#22c55e',
            description: 'Sistemi devreye alın ve tüm fonksiyonları test edin.',
            instructions: [
                'Sistemi soğutma modunda çalıştırın',
                'İç ünite çıkış sıcaklığını ölçün (Δt ≥ 8°C)',
                'Isıtma modunu test edin',
                'Uzaktan kumanda fonksiyonlarını kontrol edin',
                'Swing ve fan hızı modlarını test edin',
                'Tüm sonuçları rapor formuna kaydedin'
            ],
            order: 8,
            explodedOffset: [0, 0, 3]
        }
    ]
}

// Helper: Match job steps to 3D model parts
export function mapStepsToParts(
    steps: { id: string; title: string; isCompleted: boolean; order: number }[],
    model: AssemblyModel
): (AssemblyPart & { stepId: string; isCompleted: boolean })[] {
    return model.parts.map(part => {
        // Try to find a matching step by order or title similarity
        const matchedStep = steps.find((s, idx) => idx + 1 === part.order) || steps[0]
        return {
            ...part,
            stepId: matchedStep?.id || '',
            isCompleted: matchedStep?.isCompleted || false
        }
    })
}

// Get all available mock models
export function getAvailableModels(): AssemblyModel[] {
    return [MOCK_AC_UNIT_MODEL]
}
