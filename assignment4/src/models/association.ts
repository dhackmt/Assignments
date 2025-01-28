import Customer from "../models/customerSchema";
import Organisation from "../models/organisationSchema";
import invoice from "./invoiceSchema";
import LineItems from "./LineItemsSchema";
import OrgCust from "./OrgCustSchema";
import PaymentPlan from "./paymentPlanSchema";
import Sow from "./sowSchema";

//many to many association between org and customer
Organisation.belongsToMany(Customer,{through:OrgCust});
Customer.belongsToMany(Organisation,{through:OrgCust});


//one to one association between orgCustomer(each orgcustomer will have 1 sow) and sow
OrgCust.hasOne(Sow);
Sow.belongsTo(OrgCust);

//1 sow can have many payment plans

Sow.hasMany(PaymentPlan);
PaymentPlan.belongsTo(Sow);


//1 payment plan can have many line Items
PaymentPlan.hasMany(LineItems);
LineItems.belongsTo(PaymentPlan);


//1 payment will have only 1 invoice
PaymentPlan.hasOne(invoice);
invoice.belongsTo(PaymentPlan);

