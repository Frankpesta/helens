/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as adminIdentity from "../adminIdentity.js";
import type * as auth from "../auth.js";
import type * as checkout from "../checkout.js";
import type * as contact from "../contact.js";
import type * as crons from "../crons.js";
import type * as customerCheckout from "../customerCheckout.js";
import type * as customerOrders from "../customerOrders.js";
import type * as emailNode from "../emailNode.js";
import type * as emailTemplates_ContactAdminNotificationEmail from "../emailTemplates/ContactAdminNotificationEmail.js";
import type * as emailTemplates_HelensEmailLayout from "../emailTemplates/HelensEmailLayout.js";
import type * as emailTemplates_OrderConfirmationEmail from "../emailTemplates/OrderConfirmationEmail.js";
import type * as emailTemplates_OrderStatusEmail from "../emailTemplates/OrderStatusEmail.js";
import type * as http from "../http.js";
import type * as journal from "../journal.js";
import type * as journalSeed from "../journalSeed.js";
import type * as lib_authz from "../lib/authz.js";
import type * as lib_resolveAuthEmail from "../lib/resolveAuthEmail.js";
import type * as newsletter from "../newsletter.js";
import type * as orders from "../orders.js";
import type * as products from "../products.js";
import type * as seedAdmin from "../seedAdmin.js";
import type * as shipping from "../shipping.js";
import type * as siteSettings from "../siteSettings.js";
import type * as stripeNode from "../stripeNode.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  adminIdentity: typeof adminIdentity;
  auth: typeof auth;
  checkout: typeof checkout;
  contact: typeof contact;
  crons: typeof crons;
  customerCheckout: typeof customerCheckout;
  customerOrders: typeof customerOrders;
  emailNode: typeof emailNode;
  "emailTemplates/ContactAdminNotificationEmail": typeof emailTemplates_ContactAdminNotificationEmail;
  "emailTemplates/HelensEmailLayout": typeof emailTemplates_HelensEmailLayout;
  "emailTemplates/OrderConfirmationEmail": typeof emailTemplates_OrderConfirmationEmail;
  "emailTemplates/OrderStatusEmail": typeof emailTemplates_OrderStatusEmail;
  http: typeof http;
  journal: typeof journal;
  journalSeed: typeof journalSeed;
  "lib/authz": typeof lib_authz;
  "lib/resolveAuthEmail": typeof lib_resolveAuthEmail;
  newsletter: typeof newsletter;
  orders: typeof orders;
  products: typeof products;
  seedAdmin: typeof seedAdmin;
  shipping: typeof shipping;
  siteSettings: typeof siteSettings;
  stripeNode: typeof stripeNode;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
