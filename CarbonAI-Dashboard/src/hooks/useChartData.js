import { getVolumeByType, getVolumeByRegistry, getPriceByType, getRatingDistribution, getPortfolioStats } from '../data/projects'
import { TYPE_COLORS, REGISTRY_COLORS, T } from '../utils/tokens'

export const useVolumeByType     = () => getVolumeByType(TYPE_COLORS)
export const useVolumeByRegistry = () => getVolumeByRegistry(REGISTRY_COLORS)
export const usePriceData        = () => getPriceByType(TYPE_COLORS)
export const useRatingData       = () => getRatingDistribution(T)
export const usePortfolioStats   = () => getPortfolioStats()

/* keep old name working for any existing imports */
export const useVolumeData = useVolumeByType
