const Proposal = require('../models/Proposal');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const docx = require('docx');
const { Document, Paragraph, TextRun, Table, TableRow, TableCell, BorderStyle, AlignmentType, HeadingLevel } = docx;

// @desc    Create new proposal
// @route   POST /api/v1/proposals
// @access  Private
exports.createProposal = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;
  
  // Create proposal
  const proposal = await Proposal.create(req.body);
  
  res.status(201).json({
    success: true,
    data: proposal
  });
});

// @desc    Get all proposals for logged in user
// @route   GET /api/v1/proposals
// @access  Private
exports.getProposals = asyncHandler(async (req, res, next) => {
  const proposals = await Proposal.find({ user: req.user.id });
  
  res.status(200).json({
    success: true,
    count: proposals.length,
    data: proposals
  });
});

// @desc    Get single proposal
// @route   GET /api/v1/proposals/:id
// @access  Private
exports.getProposal = asyncHandler(async (req, res, next) => {
  const proposal = await Proposal.findById(req.params.id);
  
  if (!proposal) {
    return next(
      new ErrorResponse(`Proposal not found with id of ${req.params.id}`, 404)
    );
  }
  
  // Make sure user owns proposal
  if (proposal.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to access this proposal`,
        401
      )
    );
  }
  
  res.status(200).json({
    success: true,
    data: proposal
  });
});

// @desc    Update proposal
// @route   PUT /api/v1/proposals/:id
// @access  Private
exports.updateProposal = asyncHandler(async (req, res, next) => {
  let proposal = await Proposal.findById(req.params.id);
  
  if (!proposal) {
    return next(
      new ErrorResponse(`Proposal not found with id of ${req.params.id}`, 404)
    );
  }
  
  // Make sure user owns proposal
  if (proposal.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this proposal`,
        401
      )
    );
  }
  
  proposal = await Proposal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: proposal
  });
});

// @desc    Delete proposal
// @route   DELETE /api/v1/proposals/:id
// @access  Private
exports.deleteProposal = asyncHandler(async (req, res, next) => {
  const proposal = await Proposal.findById(req.params.id);
  
  if (!proposal) {
    return next(
      new ErrorResponse(`Proposal not found with id of ${req.params.id}`, 404)
    );
  }
  
  // Make sure user owns proposal
  if (proposal.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this proposal`,
        401
      )
    );
  }
  
  await proposal.remove();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Generate PDF proposal
// @route   GET /api/v1/proposals/:id/pdf
// @access  Private
exports.generatePDF = asyncHandler(async (req, res, next) => {
  const proposal = await Proposal.findById(req.params.id);
  
  if (!proposal) {
    return next(
      new ErrorResponse(`Proposal not found with id of ${req.params.id}`, 404)
    );
  }
  
  // Make sure user owns proposal
  if (proposal.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to access this proposal`,
        401
      )
    );
  }
  
  // Create a document
  const doc = new PDFDocument();
  
  // Set response headers
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=proposal-${proposal._id}.pdf`);
  
  // Pipe the PDF document to the response
  doc.pipe(res);
  
  // Add content to the PDF
  // Header
  doc.fontSize(25).text('PROPOSAL', { align: 'center' });
  doc.moveDown();
  doc.fontSize(18).text(proposal.title, { align: 'center' });
  doc.moveDown(2);
  
  // Client Information
  doc.fontSize(14).text('CLIENT INFORMATION', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(12).text(`Client: ${proposal.client.name}`);
  doc.fontSize(12).text(`Email: ${proposal.client.email}`);
  if (proposal.client.company) {
    doc.fontSize(12).text(`Company: ${proposal.client.company}`);
  }
  if (proposal.client.phone) {
    doc.fontSize(12).text(`Phone: ${proposal.client.phone}`);
  }
  doc.moveDown(2);
  
  // Project Details
  doc.fontSize(14).text('PROJECT DETAILS', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(12).text(proposal.projectDetails.description);
  doc.moveDown();
  
  if (proposal.projectDetails.scope) {
    doc.fontSize(12).text('Scope of Work:');
    doc.fontSize(12).text(proposal.projectDetails.scope);
    doc.moveDown();
  }
  
  if (proposal.projectDetails.deliverables && proposal.projectDetails.deliverables.length > 0) {
    doc.fontSize(12).text('Deliverables:');
    proposal.projectDetails.deliverables.forEach(deliverable => {
      doc.fontSize(12).text(`• ${deliverable}`);
    });
    doc.moveDown();
  }
  
  if (proposal.projectDetails.timeline) {
    doc.fontSize(12).text('Timeline:');
    if (proposal.projectDetails.timeline.startDate) {
      doc.fontSize(12).text(`Start Date: ${new Date(proposal.projectDetails.timeline.startDate).toLocaleDateString()}`);
    }
    if (proposal.projectDetails.timeline.endDate) {
      doc.fontSize(12).text(`End Date: ${new Date(proposal.projectDetails.timeline.endDate).toLocaleDateString()}`);
    }
    
    if (proposal.projectDetails.timeline.milestones && proposal.projectDetails.timeline.milestones.length > 0) {
      doc.moveDown(0.5);
      doc.fontSize(12).text('Milestones:');
      proposal.projectDetails.timeline.milestones.forEach(milestone => {
        doc.fontSize(12).text(`• ${milestone.title} - ${new Date(milestone.date).toLocaleDateString()}`);
        if (milestone.description) {
          doc.fontSize(10).text(`  ${milestone.description}`);
        }
      });
    }
    doc.moveDown();
  }
  
  // Pricing
  doc.fontSize(14).text('PRICING', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(12).text(`Total: ${proposal.pricing.currency} ${proposal.pricing.total.toFixed(2)}`);
  
  if (proposal.pricing.breakdown && proposal.pricing.breakdown.length > 0) {
    doc.moveDown(0.5);
    doc.fontSize(12).text('Breakdown:');
    
    // Create a simple table for pricing breakdown
    const tableTop = doc.y + 10;
    let tableRow = tableTop;
    const colWidths = [200, 100, 100, 100];
    
    // Table headers
    doc.fontSize(10).text('Item', doc.x, tableRow);
    doc.fontSize(10).text('Quantity', doc.x + colWidths[0], tableRow);
    doc.fontSize(10).text('Unit Price', doc.x + colWidths[0] + colWidths[1], tableRow);
    doc.fontSize(10).text('Amount', doc.x + colWidths[0] + colWidths[1] + colWidths[2], tableRow);
    
    tableRow += 20;
    
    // Table rows
    proposal.pricing.breakdown.forEach(item => {
      doc.fontSize(10).text(item.item, doc.x, tableRow);
      doc.fontSize(10).text(item.quantity.toString(), doc.x + colWidths[0], tableRow);
      doc.fontSize(10).text(`${proposal.pricing.currency} ${item.unitPrice.toFixed(2)}`, doc.x + colWidths[0] + colWidths[1], tableRow);
      doc.fontSize(10).text(`${proposal.pricing.currency} ${item.amount.toFixed(2)}`, doc.x + colWidths[0] + colWidths[1] + colWidths[2], tableRow);
      tableRow += 20;
    });
  }
  
  if (proposal.pricing.paymentTerms) {
    doc.moveDown();
    doc.fontSize(12).text('Payment Terms:');
    doc.fontSize(12).text(proposal.pricing.paymentTerms);
  }
  
  // Footer
  doc.moveDown(2);
  doc.fontSize(10).text(`Proposal created on ${new Date(proposal.createdAt).toLocaleDateString()}`, { align: 'center' });
  doc.fontSize(10).text('Generated by ProposalMate', { align: 'center' });
  
  // Finalize the PDF and end the stream
  doc.end();
});

// @desc    Generate DOCX proposal
// @route   GET /api/v1/proposals/:id/docx
// @access  Private
exports.generateDOCX = asyncHandler(async (req, res, next) => {
  const proposal = await Proposal.findById(req.params.id);
  
  if (!proposal) {
    return next(
      new ErrorResponse(`Proposal not found with id of ${req.params.id}`, 404)
    );
  }
  
  // Make sure user owns proposal
  if (proposal.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to access this proposal`,
        401
      )
    );
  }
  
  // Create a new document
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Title
        new Paragraph({
          text: "PROPOSAL",
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER
        }),
        new Paragraph({
          text: proposal.title,
          heading: HeadingLevel.HEADING_2,
          alignment: AlignmentType.CENTER
        }),
        new Paragraph({}),
        
        // Client Information
        new Paragraph({
          text: "CLIENT INFORMATION",
          heading: HeadingLevel.HEADING_3
        }),
        new Paragraph({
          children: [
            new TextRun(`Client: ${proposal.client.name}`)
          ]
        }),
        new Paragraph({
          children: [
            new TextRun(`Email: ${proposal.client.email}`)
          ]
        })
      ]
    }]
  });
  
  // Add company if exists
  if (proposal.client.company) {
    doc.addSection({
      children: [
        new Paragraph({
          children: [
            new TextRun(`Company: ${proposal.client.company}`)
          ]
        })
      ]
    });
  }
  
  // Add phone if exists
  if (proposal.client.phone) {
    doc.addSection({
      children: [
        new Paragraph({
          children: [
            new TextRun(`Phone: ${proposal.client.phone}`)
          ]
        })
      ]
    });
  }
  
  // Project Details
  doc.addSection({
    children: [
      new Paragraph({}),
      new Paragraph({
        text: "PROJECT DETAILS",
        heading: HeadingLevel.HEADING_3
      }),
      new Paragraph({
        children: [
          new TextRun(proposal.projectDetails.description)
        ]
      })
    ]
  });
  
  // Generate the document as a buffer
  const buffer = await docx.Packer.toBuffer(doc);
  
  // Set response headers
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  res.setHeader('Content-Disposition', `attachment; filename=proposal-${proposal._id}.docx`);
  
  // Send the buffer
  res.send(buffer);
});
