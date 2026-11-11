import type { HapticTrigger } from "../constants";
import { haptic } from "./haptics";

/**
 * What every tap calls: the vibration for this moment (if haptics and this
 * moment's switch are on).
 */
export function feedback(trigger: HapticTrigger) {
	haptic(trigger);
}
