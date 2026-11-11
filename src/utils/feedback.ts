import type { HapticTrigger } from "../constants";
import { haptic } from "./haptics";
import { sound } from "./sounds";

/**
 * What every tap calls: the vibration for this moment (if haptics and this
 * moment's switch are on) and its sound (if sounds are on).
 */
export function feedback(trigger: HapticTrigger) {
	haptic(trigger);
	sound(trigger);
}
