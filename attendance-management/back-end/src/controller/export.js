import { Parser } from "json2csv";
import User from "../model/export.js";

const exportUsersToCSV = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -__v")
      .populate({
        path: "companyWithRole.company",
        model: "Company",
        select: "name"
      })
      .populate({
        path: "companyWithRole.branch",
        model: "Branch",
        select: "name"
      });

    const usersData = users.map((user) => ({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isVerified: user.isVerified,
      lastLogin: user.lastLogin?.toISOString() || "N/A",
      lastActive: user.lastActive?.toISOString() || "N/A",
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      roles: user.companyWithRole
        .map((cr) => 
          `${cr.role} at ${cr.company?.name || "N/A"} (${cr.branch?.name || "N/A"})`
        )
        .join("; "),
    }));

    const json2csv = new Parser();
    const csv = json2csv.parse(usersData);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=user_data_export.csv");
    res.status(200).end(csv);
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({ message: "Error exporting data" });
  }
};

export { exportUsersToCSV };