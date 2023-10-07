import { classNames } from "@/utils/functions";
const columnClass: { [key: string]: string } = {
  ID: "pl-4 pr-3 font-medium text-gray-900 sm:pl-6",
  Name: "pl-4 pr-3 font-medium text-gray-900 sm:pl-6",
};

export default function LoadingRows({
  barWidth = 80,
  rowNumber = 3,
  columns,
}: {
  barWidth?: number;
  rowNumber?: number;
  columns: string[];
}) {
  const range = Array(rowNumber).fill(0);
  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column, index) => (
                    <th
                      key={index}
                      scope="col"
                      className={classNames(
                        "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
                        columnClass[column]
                      )}
                    >
                      {column}
                    </th>
                  ))}
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {range.map((_, index) => (
                  <Row key={index} width={barWidth} columns={columns} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ width, columns }: { width: number; columns: string[] }) {
  return (
    <tr>
      {columns.map((column, index) => (
        <td
          key={index}
          className={classNames(
            "whitespace-nowrap px-3 py-4 text-sm text-gray-500",
            columnClass[column]
          )}
        >
          <LoadingState width={width} />
        </td>
      ))}
      <td className="relative whitespace-nowrap py-4 text-sm text-blue-600">
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
