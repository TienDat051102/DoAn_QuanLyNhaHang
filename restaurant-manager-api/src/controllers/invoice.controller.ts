import {inject} from '@loopback/core';
import {post, requestBody, Response, RestBindings} from '@loopback/rest';
import Docxtemplater from 'docxtemplater';
import * as fs from 'fs';
import * as path from 'path';
import PizZip from 'pizzip';

export class InvoiceController {
  constructor() {}

  @post('/generate-invoice', {
    responses: {
      '200': {
        description: 'Generate Invoice Word file',
        content: {
          'application/octet-stream': {
            schema: {type: 'string', format: 'binary'},
          },
        },
      },
    },
  })
  async generateInvoice(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              invoiceCode: {type: 'number'},
              currentDate: {type: 'string'},
              customerPhone: {type: 'string'},
              discountAmount: {type: 'number'},
              selectedPaymentMethod: {type: 'string'},
              cartItems: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: {type: 'number'},
                    name: {type: 'string'},
                    price: {type: 'number'},
                  },
                },
              },
              totalAmount: {type: 'number'},
              finalAmount: {type: 'number'},
            },
            required: [
              'invoiceCode',
              'currentDate',
              'customerPhone',
              'cartItems',
              'totalAmount',
              'finalAmount',
            ],
          },
        },
      },
    })
    invoiceData: any,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<Response> {
    const templatePath = path.resolve(
      process.cwd(),
      'src/templates/templates.docx',
    );

    console.log('invoiceData', invoiceData);
    const templateContent = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(templateContent);
    const doc = new Docxtemplater(zip);
    try {
      doc.render({
        invoiceCode: String(invoiceData.invoiceCode),
        table: invoiceData.table || 'Mang Về',
        currentDate: invoiceData.currentDate,
        customerPhone: invoiceData.customerPhone,
        discountAmount: invoiceData.discountAmount.toLocaleString(),
        selectedPaymentMethod: invoiceData.selectedPaymentMethod,
        cartItems: invoiceData.cartItems.map((item: any) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price.toLocaleString(),
        })),
        totalAmount: invoiceData.totalAmount.toLocaleString(),
        finalAmount: invoiceData.finalAmount.toLocaleString(),
      });

      // Tạo file Word
      const buffer = doc.getZip().generate({type: 'nodebuffer'});

      // Thiết lập header để trả file về client
      response.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      );
      response.setHeader(
        'Content-Disposition',
        `attachment; filename=${invoiceData.currentDate}_${invoiceData.invoiceCode || 'invoice'}.docx`,
      );

      // Gửi file về client
      response.send(buffer);
      return response;
    } catch (error) {
      console.error('Error generating document:', error);
      throw error;
    }
  }
}
