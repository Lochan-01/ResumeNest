import { Request, Response } from 'express'
import Resume from '../models/Resume'
import PDFDocument from 'pdfkit'

export const exportResumePDF = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const resume = await Resume.findById(id)

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' })
    }

    if (resume.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    // Create a PDF document
    const doc = new PDFDocument()

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${resume.title}.pdf"`)

    // Pipe the PDF to the response
    doc.pipe(res)

    // Add content to PDF
    doc.fontSize(24).text(`${resume.firstName} ${resume.lastName}`, { align: 'center' })
    doc.fontSize(10).text(`${resume.email} | ${resume.phone} | ${resume.location}`, {
      align: 'center',
    })

    if (resume.summary) {
      doc.moveDown()
      doc.fontSize(14).text('Professional Summary', { underline: true })
      doc.fontSize(11).text(resume.summary)
    }

    if (resume.experience && resume.experience.length > 0) {
      doc.moveDown()
      doc.fontSize(14).text('Experience', { underline: true })
      resume.experience.forEach((exp: any) => {
        doc.fontSize(11).text(`${exp.position} at ${exp.company}`, { underline: true })
        doc.fontSize(10).text(`${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`)
        if (exp.description) {
          doc.fontSize(10).text(exp.description)
        }
        doc.moveDown(0.5)
      })
    }

    if (resume.education && resume.education.length > 0) {
      doc.moveDown()
      doc.fontSize(14).text('Education', { underline: true })
      resume.education.forEach((edu: any) => {
        doc.fontSize(11).text(`${edu.degree} in ${edu.field}`, { underline: true })
        doc.fontSize(10).text(edu.school)
        doc.fontSize(10).text(`${edu.startDate} - ${edu.endDate}`)
        doc.moveDown(0.5)
      })
    }

    if (resume.skills && resume.skills.length > 0) {
      doc.moveDown()
      doc.fontSize(14).text('Skills', { underline: true })
      const skillsText = resume.skills.map((s: any) => `${s.name} (${s.level})`).join(', ')
      doc.fontSize(10).text(skillsText)
    }

    doc.end()
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
