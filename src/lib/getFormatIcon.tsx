const FORMAT_ICONS: Record<string, string> = {
  vinyl: 'hn-disc-solid',
  cd: 'hn-disc',
  tape: 'hn-cassette-tape',
};

export function getFormatIcon(value?: string | null, size = 14) {
  const icon = FORMAT_ICONS[value ?? ''] ?? FORMAT_ICONS.vinyl;
  return <i className={`hn ${icon}`} style={{ fontSize: size, lineHeight: 1 }} />;
}
