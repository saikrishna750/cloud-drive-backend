const supabase = require('../config/supabaseClient');

const getUserData = async (req, res) => {
    const userId = req.user.id 
    try{
        const {data:getFolders, error:getFoldersError} = await supabase 
        .from('folders')
        .select("*")
        .eq('owner_id', userId)

        if(getFoldersError) {
            console.error('Error fetching folders:', getFoldersError);
            return res.status(500).json({ error: 'Failed to fetch folders.' });
        }

        const {data:getFiles, error:getFilesError} = await supabase
        .from('files')
        .select("*")
        .eq('owner_id', userId)

        if(getFilesError) {
            console.error('Error fetching files:', getFilesError);
            return res.status(500).json({ error: 'Failed to fetch files.' });
        }
        // console.log('Folders fetched successfully:', getFolders);
        // console.log('Files fetched successfully:', getFiles);
        // console.log('User ID:', userId);
        // console.log('User Email:', req.user.email);
        console.log({folders:getFolders, files:getFiles, userId:userId, email:req.user.email});
        res.json({
            userDetails: {
                id: userId,
                email: req.user.email,
            },
            folders: getFolders,
            files: getFiles
        });
    }
    catch (error){
        console.error('Unexpected error in getUserData:', error);
        return res.status(500).json({ error: 'Unexpected server error.' });
    }

}

module.exports = getUserData;