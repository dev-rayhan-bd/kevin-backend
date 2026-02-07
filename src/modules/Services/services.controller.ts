/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';

import sendResponse from '../../app/utils/sendResponse';

import httpStatus from 'http-status';

import catchAsync from '../../app/utils/catchAsync';
import { ServicesService } from './services.service';
import AppError from '../../errors/AppError';
import ServiceModel from './services.model';
import { CURRENCY_ENUM } from './service.const';

import config from '../../app/config';
import { stripe } from '../../utils/stripeClient';
import { UserModel } from '../User/user.model';

const getAllServices = catchAsync(async (req: Request, res: Response) => {
  const result = await ServicesService.getAllServicesFromDB(req?.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Services retrived succesfully!',

    data: result,
  });
});
const getAllServicesForSpecUser = catchAsync(
  async (req: Request, res: Response) => {
    const contractorId = req?.user?.userId;
    const result =
      await ServicesService.getAllServicesForSpecUserFromDB(contractorId as string);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Services retrived succesfully!',
      data: result,
    });
  },
);
const getSingleServices = catchAsync(async (req: Request, res: Response) => {
  const serviceId = req.params.id;
  const result = await ServicesService.getSingleServicesFromDB(serviceId as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Service retrived succesfully',
    data: result,
  });
});

const createServices = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // const image = req.file?.path
  const path = `${req.protocol}://${req.get('host')}/uploads/${req.file?.filename}`;
  // console.log("create revieew-->",req.file.path);
  try {
    const result = await ServicesService.addServicesIntoDB(
      req.body,
      path as string,
    );

    sendResponse(res, {
      success: true,
      message: 'Service Added Sucessfully',
      statusCode: httpStatus.CREATED,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
// const initiateOrderPayment = catchAsync(async (req: Request, res: Response) => {
//   const { items,customerEmail } = req.body;
//   // const { purpose } = req.query;

//   if (!items || items.length === 0) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'No items in the order.');
//   }

//   const serviceId = items.map((item: any) => item.serviceId);

//   const services = await ServiceModel.find({ _id: { $in: serviceId } });

//   const lineItems = items.map((item: any) => {
//     const service = services.find(
//       (b: any) => b._id.toString() === item.serviceId.toString(),
//     );
//     if (!service)
//       throw new AppError(httpStatus.BAD_REQUEST, 'No items in the order.');
//     const basePrice = service.price;
//     // let finalPrice = basePrice;

//     // if (service.isDiscount && service.discountPrice) {
//     //   if (service.discountPrice.type === 'percentage') {
//     //     finalPrice = basePrice - (service.discountPrice.amount / 100) * basePrice;
//     //   } else {
//     //     finalPrice = basePrice - service.discountPrice.amount;
//     //   }
//     // }

//     return {
//       price_data: {
//         currency: CURRENCY_ENUM.USD,
//         product_data: {
//           name: service.title,
//         },
//         unit_amount: Math.round(basePrice * 100),
//       },
//       quantity: item.hour,
//     };
//   });

//   // Add shipping cost as an additional line item
//   // if (shippingCost && shippingCost > 0) {
//   //   lineItems.push({
//   //     price_data: {
//   //       currency: CURRENCY_ENUM.USD,
//   //       product_data: {
//   //         name: 'Shipping Cost',
//   //       },
//   //       unit_amount: Math.round(shippingCost * 100),
//   //     },
//   //     quantity: 1,
//   //   });
//   // }
//   // console.log(purpose)
//   const baseUrl = (config.frontend_url || '').replace(/\/+$/, '');
//   if (!baseUrl) throw new Error('FRONTEND_URL not configured');
//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ['card'],
//     line_items: lineItems,
//     mode: 'payment',
//     customer_email: customerEmail,
//     success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}}`,
//     cancel_url: `${config.frontend_url}/cancel`,
//   });

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Order created successfully',
//     data: { url: session.url },
//   });
// });
const initiateOrderPayment = catchAsync(async (req: Request, res: Response) => {
    const meId = req?.user?.userId
    const user = await UserModel.findById(meId as string);
    // console.log("user------>",user?.email);
    const email = user?.email
  const { item} = req.body; // use item, not items
  const { id } = req.params;
  console.log('book service id--->', id);
  if (!item) {
    throw new AppError(httpStatus.BAD_REQUEST, 'No item in the order.');
  }

  const service = await ServiceModel.findById(item.serviceId );
  if (!service) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Service not found.');
  }

  const basePrice = service.price;

  const lineItem = {
    price_data: {
      currency: CURRENCY_ENUM.USD,
      product_data: {
        name: service.title,
      },
      unit_amount: Math.round(basePrice * 100),
    },
    quantity: item.hour,
  };

  const baseUrl = (config.frontend_url || '').replace(/\/+$/, '');
  if (!baseUrl) throw new Error('FRONTEND_URL not configured');

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [lineItem], // wrap single item into array for Stripe
    mode: 'payment',
    customer_email:email,
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/cancel`,
    metadata: {
      bookServiceId: String(id),
    },
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order created successfully',
    data: { url: session.url },
  });
});

const acceptSingleProject = catchAsync(async (req: Request, res: Response) => {
  const { serviceId } = req.params;

  const result = await ServicesService.acceptProject(serviceId as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Service accepted succesfully!',
    data: result,
  });
});

const rejectSingleProject = catchAsync(async (req: Request, res: Response) => {
  const { serviceId } = req.params;

  const result = await ServicesService.rejectProject(serviceId as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Service rejected succesfully!',
    data: result,
  });
});

export const servicesControllers = {
  createServices,
  getAllServices,
  acceptSingleProject,
  rejectSingleProject,
  getAllServicesForSpecUser,
  getSingleServices,
  initiateOrderPayment,
};
