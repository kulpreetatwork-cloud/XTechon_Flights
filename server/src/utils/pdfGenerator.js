import PDFDocument from 'pdfkit';

/**
 * Generate PDF Ticket
 * 
 * The PDF includes:
 * - Passenger name
 * - Airline & Flight ID
 * - Route (Departure → Arrival)
 * - Final price paid
 * - Booking date & time
 * - Unique PNR
 */

export const generateTicketPDF = (booking) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size: 'A4',
                margin: 50
            });

            const chunks = [];
            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            // Header with gradient effect simulation
            doc.rect(0, 0, doc.page.width, 150).fill('#1e3a5f');

            // Airline logo placeholder and title
            doc.fontSize(28)
                .fillColor('#ffffff')
                .font('Helvetica-Bold')
                .text('✈ FLIGHT TICKET', 50, 50, { align: 'center' });

            doc.fontSize(14)
                .fillColor('#87ceeb')
                .text('XTechon Airlines Booking System', 50, 90, { align: 'center' });

            // PNR Badge
            doc.roundedRect(doc.page.width - 150, 40, 100, 40, 5)
                .fill('#ff6b35');
            doc.fontSize(10)
                .fillColor('#ffffff')
                .text('PNR', doc.page.width - 140, 48);
            doc.fontSize(14)
                .font('Helvetica-Bold')
                .text(booking.pnr, doc.page.width - 140, 62);

            // Main content area
            let y = 180;

            // Passenger Details Section
            doc.roundedRect(40, y, doc.page.width - 80, 80, 10)
                .fillAndStroke('#f8f9fa', '#e9ecef');

            doc.fontSize(10)
                .fillColor('#6c757d')
                .font('Helvetica')
                .text('PASSENGER NAME', 60, y + 15);
            doc.fontSize(18)
                .fillColor('#212529')
                .font('Helvetica-Bold')
                .text(booking.passenger_name.toUpperCase(), 60, y + 32);

            doc.fontSize(10)
                .fillColor('#6c757d')
                .font('Helvetica')
                .text('EMAIL', 350, y + 15);
            doc.fontSize(12)
                .fillColor('#212529')
                .font('Helvetica')
                .text(booking.passenger_email, 350, y + 32);

            y += 100;

            // Flight Details Section
            doc.roundedRect(40, y, doc.page.width - 80, 140, 10)
                .fillAndStroke('#fff3e0', '#ffe0b2');

            // Departure
            doc.fontSize(10)
                .fillColor('#6c757d')
                .text('FROM', 60, y + 15);
            doc.fontSize(24)
                .fillColor('#1e3a5f')
                .font('Helvetica-Bold')
                .text(booking.flight_details.departure_city, 60, y + 32);
            doc.fontSize(12)
                .fillColor('#495057')
                .font('Helvetica')
                .text(booking.flight_details.departure_time, 60, y + 65);

            // Arrow
            doc.fontSize(30)
                .fillColor('#ff6b35')
                .text('→', doc.page.width / 2 - 20, y + 40);

            // Arrival
            doc.fontSize(10)
                .fillColor('#6c757d')
                .font('Helvetica')
                .text('TO', 380, y + 15);
            doc.fontSize(24)
                .fillColor('#1e3a5f')
                .font('Helvetica-Bold')
                .text(booking.flight_details.arrival_city, 380, y + 32);
            doc.fontSize(12)
                .fillColor('#495057')
                .font('Helvetica')
                .text(booking.flight_details.arrival_time, 380, y + 65);

            // Flight info row
            doc.fontSize(10)
                .fillColor('#6c757d')
                .text('FLIGHT', 60, y + 95);
            doc.fontSize(12)
                .fillColor('#212529')
                .font('Helvetica-Bold')
                .text(`${booking.flight_details.airline} - ${booking.flight_details.flight_id}`, 60, y + 110);

            doc.fontSize(10)
                .fillColor('#6c757d')
                .font('Helvetica')
                .text('DURATION', 250, y + 95);
            doc.fontSize(12)
                .fillColor('#212529')
                .font('Helvetica-Bold')
                .text(booking.flight_details.duration, 250, y + 110);

            y += 160;

            // Payment Details Section
            doc.roundedRect(40, y, doc.page.width - 80, 100, 10)
                .fillAndStroke('#e8f5e9', '#c8e6c9');

            doc.fontSize(10)
                .fillColor('#6c757d')
                .font('Helvetica')
                .text('BOOKING DATE & TIME', 60, y + 15);
            doc.fontSize(14)
                .fillColor('#212529')
                .font('Helvetica-Bold')
                .text(new Date(booking.booking_date).toLocaleString('en-IN', {
                    dateStyle: 'full',
                    timeStyle: 'short'
                }), 60, y + 32);

            doc.fontSize(10)
                .fillColor('#6c757d')
                .font('Helvetica')
                .text('AMOUNT PAID', 380, y + 15);
            doc.fontSize(24)
                .fillColor('#2e7d32')
                .font('Helvetica-Bold')
                .text(`₹${booking.final_price.toLocaleString('en-IN')}`, 380, y + 32);

            if (booking.surge_applied) {
                doc.fontSize(10)
                    .fillColor('#ff6b35')
                    .text(`(Includes ${booking.surge_percentage}% surge)`, 380, y + 62);
            }

            y += 120;

            // Barcode simulation
            doc.rect(40, y, doc.page.width - 80, 50).fill('#f8f9fa');
            doc.fontSize(12)
                .fillColor('#6c757d')
                .text('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||', 50, y + 10, {
                    align: 'center',
                    characterSpacing: 2
                });
            doc.fontSize(10)
                .text(booking.pnr, 50, y + 32, { align: 'center' });

            y += 70;

            // Footer
            doc.fontSize(9)
                .fillColor('#adb5bd')
                .text('This is a computer-generated ticket. Please carry a valid ID proof during travel.', 50, y, {
                    align: 'center'
                });
            doc.text('Thank you for choosing XTechon Airlines!', 50, y + 15, { align: 'center' });

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

export default generateTicketPDF;
