const supabase = require("../config/supabaseClient");
const upload = require('../middlewares/multerMiddleware');

const uploadFile = async (req, res) => {
   try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const { originalname, mimetype, size, buffer } = req.file;
    const { folder_id } = req.body;
    const owner_id = req.user.id; // from auth middleware

    // Upload file to Supabase bucket
    const filePath = `${owner_id}/${Date.now()}-${originalname}`;

    const { error: uploadError } = await supabase.storage
      .from("google-drive-clone") // your bucket name
      .upload(filePath, buffer, {
        contentType: mimetype,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("google-drive-clone")
      .getPublicUrl(filePath);

    const fileUrl = publicUrlData.publicUrl;

    // Insert metadata into files table
    const { error: dbError } = await supabase.from("files").insert([
      {
        name: originalname,
        owner_id,
        folder_id,
        mime_type: mimetype,
        size,
        file_url: fileUrl,
      },
    ])
    .select();

    if (dbError) throw dbError;
    console.log("File uploaded successfully:", fileUrl);
    res.json({ message: "File uploaded successfully", fileUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = uploadFile