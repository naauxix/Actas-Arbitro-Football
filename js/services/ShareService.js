export class ShareService {

  static async sharePDF(blob) {

    if (navigator.share) {

      const file = new File(
        [blob],
        "acta.pdf",
        { type: "application/pdf" }
      );

      await navigator.share({
        files: [file],
        title: "Acta del partido"
      });

    } else {

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;
      a.download = "acta.pdf";

      a.click();
    }
  }
}