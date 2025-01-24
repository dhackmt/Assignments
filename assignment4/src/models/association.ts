import Customer from "../models/customerSchema";
import Organisation from "../models/organisationSchema";
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