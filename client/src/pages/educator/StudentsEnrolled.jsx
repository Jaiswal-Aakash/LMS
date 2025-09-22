import React, { useEffect, useState } from "react";
import { dummyStudentEnrolled } from "../../assets/assets";
import Loading from "../../components/student/Loading";

const StudentsEnrolled = () => {
  const [studentEnrolled, setStudentEnrolled] = useState(null);
  const fetchStudentEnrolled = async () => {
    setStudentEnrolled(dummyStudentEnrolled);
  };

  useEffect(() => {
    fetchStudentEnrolled();
  }, []);
  return studentEnrolled ? (
    <div className="h-screen flex felx-col itmes-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="w-full">
        <h2 className="pb-4 text-lg font-medium">Enrolled Students</h2>
        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className="md:table-auto table-fixed w-full overflow-hidden">
            <thead className="text-gray-900 border-b gorder-gray-500/20 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">
                  #
                </th>

                <th className="px-4 py-3 font-semibold truncate">
                  Student name
                </th>
                <th className="px-4 py-3 font-semibold truncate">
                  Course Title
                </th>
                <th className="px-4 py-3 font-semibold hidden sm:table-cell">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {studentEnrolled.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-500/20 hover:bg-gray-100/90"
                >
                  <td className="px-4 py-3 text-center hidden sm:table-cell">
                    {index + 1}
                  </td>
                  <td className="md:px-4 px-2 py-3 flex items-center space-x-3">
                    <img
                      src={item.student.imageUrl}
                      alt="Profile"
                      className="w-9 h-9 rounded-full"
                    />
                    <span className="truncate">{item.student.name}</span>
                  </td>
                  <td className="px-4 py-3 truncate">{item.courseTitle}</td>

                  <td className="px-4 py-3= hidden sm:table-cell">
                    {new Date(item.purchaseDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default StudentsEnrolled;
