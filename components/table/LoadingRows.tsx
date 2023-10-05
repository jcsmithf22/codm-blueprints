export default function LoadingRows({
  barWidth = 80,
  rowNumber = 3,
  columnNumber,
}: {
  barWidth?: number;
  rowNumber?: number;
  columnNumber: number;
}) {
  const range = Array(rowNumber).fill(0);
  return range.map((_, index) => (
    <Row key={index} width={barWidth} columnNumber={columnNumber} />
  ));
}

function Row({ width, columnNumber }: { width: number; columnNumber: number }) {
  if (columnNumber === 1) return;
  const range = Array(columnNumber - 1).fill(0);
  return (
    <tr>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
        <LoadingState width={width} />
      </td>
      {range.map((_, index) => (
        <td
          key={index}
          className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
        >
          <LoadingState width={width} />
        </td>
      ))}
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 text-blue-600">
        Edit
      </td>
    </tr>
  );
}

function LoadingState({ width }: { width: number }) {
  return (
    <div
      className="animate-pulse bg-gray-200 rounded h-4 overflow-hidden"
      style={{
        width: `${width}%`,
      }}
    />
  );
}
