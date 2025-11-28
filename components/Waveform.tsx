import React from 'react';

interface WaveformProps {
  data: number[];
  height: number;
  width: number;
  color?: string;
}

const Waveform: React.FC<WaveformProps> = ({
  data,
  height,
  width,
  color = '#212529', // light-text-primary
}) => {
  if (width === 0 || data.length === 0) return null;

  const barWidth = 4; // 두꺼운 바 너비
  const barSpacing = 2; // 바 사이 간격
  const totalBarWidth = barWidth + barSpacing;
  const numBarsToDisplay = Math.floor(width / totalBarWidth);

  // 표시할 바의 수에 맞춰 데이터 다운샘플링
  const sampledData = React.useMemo(() => {
    if (numBarsToDisplay <= 0) return [];
    if (data.length <= numBarsToDisplay) {
        // 데이터가 충분히 적으면 그대로 사용하고 간격을 조정
        return data;
    }

    const step = data.length / numBarsToDisplay;
    const result = [];
    for (let i = 0; i < numBarsToDisplay; i++) {
        const start = Math.floor(i * step);
        const end = Math.floor((i + 1) * step);
        const chunk = data.slice(start, end);
        // 청크의 최대값을 사용하여 피크를 더 잘 표현
        const peak = chunk.reduce((max, val) => Math.max(max, val), 0);
        result.push(peak);
    }
    return result;
  }, [data, numBarsToDisplay]);

  // 데이터가 적을 경우 간격을 동적으로 계산
  const effectiveBarSpacing = data.length < numBarsToDisplay ? (width - (data.length * barWidth)) / Math.max(1, data.length - 1) : barSpacing;
  const effectiveTotalBarWidth = barWidth + effectiveBarSpacing;


  const maxVal = 1;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
    >
      <g>
        {sampledData.map((d, i) => {
          const barHeight = Math.max(2, (d / maxVal) * (height * 0.9)); // 높이를 약간 줄여 여백 확보
          const barX = i * effectiveTotalBarWidth;

          return (
            <rect
              key={i}
              x={barX}
              y={(height - barHeight) / 2}
              width={barWidth}
              height={barHeight}
              fill={color}
              rx={barWidth / 2} // 완전히 둥글게 처리하여 캡슐 모양을 만듭니다.
              ry={barWidth / 2}
            />
          );
        })}
      </g>
    </svg>
  );
};

export default React.memo(Waveform);