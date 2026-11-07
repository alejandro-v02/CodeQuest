import { addIcons } from 'ionicons';
import {
  home,
  statsChart,
  statsChartOutline,
  personCircle,
  personOutline,
  refresh,
} from 'ionicons/icons';

// Standalone Ionic requires icons to be registered by name before use in
// templates. Centralized here once instead of repeating addIcons() per page.
export function registerIcons(): void {
  addIcons({
    home,
    'stats-chart': statsChart,
    'stats-chart-outline': statsChartOutline,
    'person-circle': personCircle,
    'person-outline': personOutline,
    refresh,
  });
}
