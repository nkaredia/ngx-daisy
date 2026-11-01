/** Shared native geometry: independent scrolling sidebars never consume the page gutter. */
export function nativeShowcaseGeometry(width: number, themeBuilder: boolean) {
  const viewport = Number.isFinite(width) && width > 0 ? width : 390;
  const desktop = viewport >= 1024;
  const persistentNavigation = desktop && !themeBuilder;
  const sectionNavigation = viewport >= 1320 && !themeBuilder;
  return {
    persistentNavigation,
    sectionNavigation,
    columns: persistentNavigation ? (sectionNavigation ? '288, *, 176' : '288, *') : '*',
    contentWidth: Math.max(
      1,
      Math.min(
        1056,
        viewport -
          (persistentNavigation ? 288 : 0) -
          (sectionNavigation ? 176 : 0) -
          (desktop ? 48 : 32),
      ),
    ),
  };
}
