const { Client, Databases, ID } = require("node-appwrite");

// Export the function for Appwrite to execute
module.exports = async function (req, res) {
  // Initialize the Appwrite client
  const client = new Client()
    .setEndpoint(req.variables["EXPO_PUBLIC_APPWRITE_ENDPOINT"] || "https://cloud.appwrite.io/v1") // Your Appwrite endpoint
    .setProject(req.variables["EXPO_PUBLIC_APPWRITE_PROJECT_ID"]) // Your project ID
    .setKey(req.variables["EXPO_PUBLIC_APPWRITE_TRIPELAGOSSYSTEMALERT_USER_ID"]); // API key with appropriate permissions

  const databases = new Databases(client);

  // Parse the event payload
  const payload = JSON.parse(req.payload || "{}");
  const order = payload; // The newly created order document

  // Extract relevant fields from the Orders collection
  const {
    userid,
    orderdate,
    sendamountusd,
    userrecipientid,
    theyreceiveamountphp,
    deliverymethodname,
    userpaymentmethodid,
    paymentmethodname,
    isactive,
  } = order;

  // Define the data for Ordersrecipientuserpaymentview
  const recipientViewData = {
    userid,
    orderdate,
    sendamountusd,
    userrecipientid,
    theyreceiveamountphp,
    deliverymethodname,
    userpaymentmethodid,
    paymentmethodname,
    isactive,
    isrefunded: false, // Default value since it's not in Orders
  };

  try {
    // Create a new document in Ordersrecipientuserpaymentview collection
    const response = await databases.createDocument(
      req.variables["EXPO_PUBLIC_APPWRITE_DATABASE_ID"], // Database ID
      req.variables["APPWRITE_ORDERSRECIPIENTUSERPAYMENTVIEW_COLLECTION_ID"], // Collection ID
      ID.unique(), // Generate a unique ID
      recipientViewData
    );

    // Log success and return response
    console.log("Successfully created document in Ordersrecipientuserpaymentview:", response);
    res.json({
      success: true,
      message: "Ordersrecipientuserpaymentview populated successfully",
      document: response,
    });
  } catch (error) {
    console.error("Error creating document:", error);
    res.json({
      success: false,
      message: "Failed to populate Ordersrecipientuserpaymentview",
      error: error.message,
    });
  }
};