import React from "react";

const TableLog = ({
  tHeader,
  tBody,
  handler = () => {},
  isAction = false,
  onEdit = () => {},
  onDelete = () => {},
  rowRenderer = null,
  showIndex = false,
  page = 1,
  perPage = 20,
}) => {
  return (
    <div className="w-full h-full relative overflow-auto border border-gray-200 rounded-lg shadow-sm">
      <table className="w-full text-left border-collapse text-sm">
        <thead className="bg-navy-900 text-white sticky top-0 shadow-sm">
          <tr className="capitalize">
            {showIndex && (
              <th className="p-4 font-semibold whitespace-nowrap border-b border-gray-300">
                No.
              </th>
            )}
            {tHeader.map((header, index) => (
              <th
                key={index}
                className="p-4 font-semibold whitespace-nowrap border-b border-gray-300 text-center"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {tBody.length === 0 ? (
            <tr>
              <td
                colSpan={tHeader.length + (showIndex ? 1 : 0)}
                className="p-8 text-center text-gray-500 font-medium"
              >
                No data available
              </td>
            </tr>
          ) : (
            tBody.map((row, index) => (
              <tr
                key={index}
                onClick={() => handler(row, index)}
                className="hover:bg-gray-50 border-b border-gray-100 transition-colors cursor-pointer"
              >
                {showIndex && (
                  <td className="p-4 text-gray-700">
                    {(page - 1) * perPage + index + 1}
                  </td>
                )}
                {rowRenderer ? (
                  rowRenderer(row, index)
                ) : (
                  <>
                    {Object.keys(row).map((key, cellIndex) =>
                      key === "profile_image" ? (
                        <td key={cellIndex} className="p-4">
                          <img
                            src={row[key]}
                            alt="Profile"
                            className="w-[100px] h-[100px] object-cover rounded-full shadow-sm"
                          />
                        </td>
                      ) : (
                        <td
                          key={cellIndex}
                          className="p-4 text-gray-700 truncate max-w-xs"
                        >
                          {row[key]}
                        </td>
                      ),
                    )}
                  </>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableLog;
