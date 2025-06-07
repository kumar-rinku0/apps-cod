import { useParams } from "react-router";

const CatererDashboard = () => {
  const { id } = useParams<string>();
  console.log(id);
  return (
    <>
      <div className="min-h-screen w-full bg-gray-100 flex">
        <main className="flex-1 p-6 overflow-auto">
          {/* Header */}
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Dashboard Overview
            </h1>
            <div className="flex items-center space-x-6">
              <button className="relative p-1 text-gray-600 hover:text-gray-900">
                <span className="sr-only">Notifications</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              <button className="text-gray-600 hover:text-gray-900">
                <span className="sr-only">Help</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                  AN
                </div>
              </div>
            </div>
          </header>

          {/* Top Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Today's Quotations */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg text-gray-800">
                  Today's Quotations
                </h2>
                <button className="text-sm text-blue-600 hover:underline">
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b text-gray-600">
                      <th className="pb-2">Quotation ID</th>
                      <th className="pb-2">Customer Name</th>
                      <th className="pb-2">Operator Name</th>
                      <th className="pb-2">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        id: "C001",
                        customer: "Aarti Singh",
                        operator: "Rahul",
                      },
                      {
                        id: "C002",
                        customer: "Manish Patel",
                        operator: "Nidhi",
                      },
                      { id: "C003", customer: "Priya Das", operator: "Soham" },
                    ].map((q) => (
                      <tr key={q.id} className="border-b hover:bg-gray-50">
                        <td className="py-3">{q.id}</td>
                        <td className="py-3">{q.customer}</td>
                        <td className="py-3">{q.operator}</td>
                        <td className="py-3">
                          <button className="text-blue-600 hover:underline">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Today's Events */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg text-gray-800">
                  Today's Events
                </h2>
                <button className="text-sm text-blue-600 hover:underline">
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b text-gray-600">
                      <th className="pb-2">Event</th>
                      <th className="pb-2">Customer</th>
                      <th className="pb-2">Time</th>
                      <th className="pb-2">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        event: "Wedding",
                        customer: "Raj Kumar",
                        time: "10:00 AM",
                      },
                      {
                        event: "Birthday",
                        customer: "Suman Sharma",
                        time: "7:00 PM",
                      },
                    ].map((e, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3">{e.event}</td>
                        <td className="py-3">{e.customer}</td>
                        <td className="py-3">{e.time}</td>
                        <td className="py-3">
                          <button className="text-blue-600 hover:underline">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Bottom Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Quotation Status */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="font-bold text-lg text-gray-800 mb-4">
                Quotation Status
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Approved</span>
                    <span className="font-medium">128</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: "70%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Rejected</span>
                    <span className="font-medium">36</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: "20%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Cancelled</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: "10%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Inventory */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg text-gray-800">
                  Current Inventory
                </h2>
                <button className="text-sm text-blue-600 hover:underline">
                  Manage
                </button>
              </div>
              <div className="space-y-3">
                {[
                  { category: "Vegetables", items: 120, color: "bg-blue-500" },
                  {
                    category: "Meat & Poultry",
                    items: 200,
                    color: "bg-purple-500",
                  },
                  { category: "Dairy", items: 85, color: "bg-orange-500" },
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.category}</span>
                      <span className="font-medium">{item.items} items</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${item.color} h-2 rounded-full`}
                        style={{
                          width: `${Math.min(100, (item.items / 300) * 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Manage Staff Tasks */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg text-gray-800">Staff Tasks</h2>
                <button className="text-sm text-blue-600 hover:underline">
                  Assign New
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b text-gray-600">
                      <th className="pb-2">Operator ID</th>
                      <th className="pb-2">Name</th>
                      <th className="pb-2">Tasks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: "OP001", name: "Aarti Singh", tasks: 3 },
                      { id: "OP002", name: "Manish Patel", tasks: 5 },
                      { id: "OP003", name: "Rahul Verma", tasks: 2 },
                    ].map((s) => (
                      <tr key={s.id} className="border-b hover:bg-gray-50">
                        <td className="py-3">{s.id}</td>
                        <td className="py-3">{s.name}</td>
                        <td className="py-3">
                          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-500 rounded-full">
                            {s.tasks}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default CatererDashboard;
