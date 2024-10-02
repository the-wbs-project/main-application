

using System.Drawing;
using PdfSharp.Drawing;
using PdfSharp.Pdf;

namespace Wbs.Core.Services;

public class ImageConverterService
{
    public static byte[] AddImageFromStream(byte[] imageArray)
    {
        using var imageStream = new MemoryStream(imageArray, 0, imageArray.Length, true, true);

        var pdfDocument = new PdfDocument();
        var stream = new MemoryStream();
        var page = pdfDocument.AddPage();
        var gfx = XGraphics.FromPdfPage(page);

        page.Orientation = PdfSharp.PageOrientation.Landscape;

        using var img = SixLabors.ImageSharp.Image.Load(imageStream);

        var width = page.Width.Point;
        var height = page.Height.Point;

        if (img.Width > img.Height)
        {
            height = (page.Width.Point / img.Width) * img.Height;
        }
        else
        {
            width = (page.Height.Point / img.Height) * img.Width;
        }

        gfx.DrawImage(XImage.FromStream(imageStream), 0, 0, width, height);

        pdfDocument.Close();
        pdfDocument.Save(stream, false);

        return stream.ToArray();
    }
}