import {
     FiMenu, FiFileText,
    FiCreditCard, 
    FiBell, FiHelpCircle, FiCalendar, FiUser,
    FiEye, FiChevronDown, FiSearch, FiPlus
  } from 'react-icons/fi';
  
  // Data
  const infoCards: Array<InfoCardProps> = [
    { label: "New Quotations", value: 6, icon: FiFileText, color: "indigo", note: "↑ 12% from yesterday" },
    { label: "Current Menu", value: 24, icon: FiMenu, color: "green", note: "Last updated 2h ago" },
    { label: "Recent Payments", value: "₹12,500", icon: FiCreditCard, color: "blue", note: "↑ ₹1,200 this week" },
    { label: "Recent Calls", value: 14, color: "purple", note: "3 missed calls", customIcon: true }
  ];
  
  const quotations: Array<{
      id: string;
      name: string;
      event: string;
      start: string;
      end: string;
      phone: string;
      status: "Pending" | "Approved" | "Cancelled" | "Rejected";
  }> = [
      { id: 'Q101', name: 'Neha Kapoor', event: 'Wedding', start: '2025-04-20', end: '2025-04-21', phone: '9876543210', status: 'Pending' },
      { id: 'Q102', name: 'Ravi Mehta', event: 'Birthday', start: '2025-04-22', end: '2025-04-22', phone: '9123456780', status: 'Approved' },
      { id: 'Q103', name: 'Sunita Roy', event: 'Corporate', start: '2025-04-25', end: '2025-04-25', phone: '9812345678', status: 'Cancelled' },
      { id: 'Q104', name: 'Arjun Singh', event: 'Anniversary', start: '2025-04-30', end: '2025-04-30', phone: '9001234567', status: 'Rejected' },
      { id: 'Q105', name: 'Priya Sharma', event: 'Birthday', start: '2025-05-02', end: '2025-05-02', phone: '9012345678', status: 'Pending' }
    ];
  
  const colorClasses = {
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
    green: { bg: 'bg-green-50', text: 'text-green-600' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600' }
  };
  
  interface InfoCardProps {
    label: string;
    value: string | number;
    icon?: React.ComponentType<{ className?: string }>;
    color: keyof typeof colorClasses;
    note?: string;
    customIcon?: boolean;
  }
  
  const InfoCard: React.FC<InfoCardProps> = ({ label, value, icon: Icon, color, note, customIcon }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`p-3 ${colorClasses[color].bg} rounded-lg`}>
          {customIcon ? (
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${colorClasses[color].text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          ) : Icon && <Icon className={`h-5 w-5 ${colorClasses[color].text}`} />}
        </div>
      </div>
      {note && <p className={`text-xs mt-3 ${note.startsWith("↑") ? 'text-green-500' : 'text-gray-500'}`}>{note}</p>}
    </div>
  );
  
  const statusClasses = {
    Approved: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Cancelled: 'bg-red-100 text-red-800',
    Rejected: 'bg-gray-100 text-gray-800'
  };
  
  const StatusBadge: React.FC<{ status: keyof typeof statusClasses }> = ({ status }) => (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusClasses[status]}`}>
      {status}
    </span>
  );
  
  const OperatorDashboard = () => (
    <div className="h-screen bg-gray-50 font-sans text-gray-800 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-800">Dashboard Overview</h1>
  
        <div className="flex items-center space-x-6">
          <div className="hidden md:flex space-x-6">
            <a className="text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-1">Overview</a>
            <a className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600">
              <FiCalendar className="w-4 h-4" />
              <span>Calendar</span>
            </a>
            <a className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600">
              <FiUser className="w-4 h-4" />
              <span>Customer</span>
            </a>
          </div>
  
          <div className="flex items-center space-x-4">
            <button className="relative p-2 rounded-full hover:bg-gray-100">
              <FiBell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <FiHelpCircle className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-2">
              <img
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="User"
                className="w-8 h-8 rounded-full object-cover"
              />
              <FiChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        </div>
      </header>
  
      <main className="flex-1 overflow-auto p-6 space-y-8">
        {/* Search and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative w-full md:w-80">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">
            <FiPlus className="w-4 h-4" />
            <span>New Quotation</span>
          </button>
        </div>
  
        {/* Cards Section */}
        <section>
          <h2 className="text-lg font-bold mb-4 text-gray-800">Today's Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {infoCards.map((card, idx) => (
              <InfoCard key={idx} {...card} />
            ))}
          </div>
        </section>
  
        {/* Table Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Recent Quotations</h2>
            <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
              View All
            </button>
          </div>
  
          <div className="overflow-auto bg-white rounded-xl shadow-sm border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["ID", "Customer Name", "Event Type", "Date", "Phone", "Status", "Actions"].map((header, i) => (
                    <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quotations.map((q) => (
                  <tr key={q.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{q.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{q.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{q.event}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{q.start === q.end ? q.start : `${q.start} to ${q.end}`}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{q.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={q.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 flex items-center space-x-1">
                        <FiEye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
  
  export default OperatorDashboard;
  