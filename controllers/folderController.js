const supabase = require('../config/supabaseClient');  

exports. createFolder = async (req, res) => {
  const { name, parent_id } = req.body;
  const userId = req.user.id;
    try {
      // Insert new folder
      const { data: folderData, error: folderError } = await supabase
        .from('folders')
        .insert([
          { name, owner_id: userId, parent_id }
        ])
        .select();

      if (folderError) {
        console.error('Error creating folder:', folderError);
        return res.status(500).json({ error: 'Failed to create folder.' });
      }
      
      console.log('Folder created successfully:', folderData);
      return res.json(folderData);
    } catch (err) {
      console.error('Unexpected error in createFolder:', err);
      return res.status(500).json({ error: 'Unexpected server error.' });
    }
}


exports. getFolders = async (req, res) => {
  const userId = req.user.id;
  try {
    const { data: folders, error } = await supabase
      .from('folders')
      .select('*')
      .eq('owner_id', userId);

    if (error) {
      console.error('Error fetching folders:', error);
      return res.status(500).json({ error: 'Failed to fetch folders.' });
    }

    // console.log('Folders fetched successfully:', folders);
    return res.json(folders);
  } catch (err) {
    console.error('Unexpected error in getFolders:', err);
    return res.status(500).json({ error: 'Unexpected server error.' });
  }
}

exports.renameFoder = async (req, res) => {
  const {folderId, newName} = req.body
  const userId = req.user.id

  try{
    const {data:renameFolder, error: renameError} = await supabase
    .from('folders')
    .update({name:newName})
    .eq('id', folderId)
    .eq('owner_id', userId) 

    if (renameError){
      console.log('Error renaming folder:', renameError);
      return res.status(500).json({error: 'Failed to rename folder.'});
    }
    console.log('Folder renamed successfully:', renameFolder);
    return res.json(renameFolder);
  }
  catch (err){
    console.error('Unexpected error in renameFolder:', err);
    return res.status(500).json({ error: 'Unexpected server error.' });
  }
 }

 exports.getStarredFolders = async (req, res) => {
  const userId = req.user.id
  const {folderId} = req.body
  try{
    const { data:starredData, error:starredError } = await supabase
    .from('starred')
    .insert([
      { user: userId, folder: folderId, file: null }
    ])
    .select();
    if (starredError){
      console.log('Error starring folder:', starredError);
      return res.status(500).json({error: 'Failed to star folder.'});
    }

    console.log('Folder starred successfully:', starredData);
    return res.status(200).json(starredData)
    
  }
  catch (err){
    console.error('Unexpected error in starring folder:', err);
    return res.status(500).json({ error: 'Unexpected server error.' });
  }  
 }

 exports.removeStarredFolder = async (req, res) => {
  const userId = req.user.id
  const {folderId} = req.body
  try{
    const { data:unstarredData, error:unstarredError } = await supabase
    .from('starred')
    .delete()
    .eq('user', userId)
    .eq('folder', folderId)
    .select();
    if (unstarredError){
      console.log('Error unstarring folder:', unstarredError);
      return res.status(500).json({error: 'Failed to unstar folder.'});
    }

    console.log('Folder unstarred successfully:', unstarredData);
    return res.status(200).json(unstarredData)
    
  }
  catch (err){
    console.error('Unexpected error in unstarring folder:', err);
    return res.status(500).json({ error: 'Unexpected server error.' });
  }
}

exports.fetchStarredFolders = async (req, res) => {
  const userId = req.user.id;
  try {
    const { data: starredFolders, error:starredError } = await supabase
      .from('starred')
      .select('folder')
      .eq('user', userId)
      .not('folder', 'is', null); // Ensure we only get starred folders

    if (starredError) {
      console.error('Error fetching starred folders:', error);
      return res.status(500).json({ error: 'Failed to fetch starred folders.' });
    }

    // Extract folder details from the nested structure
    // const folders = starredFolders.map(entry => entry.folder);

    console.log('Starred folders fetched successfully:', starredFolders);
    return res.json(starredFolders);
  } catch (err) {
    console.error('Unexpected error in getStarredFolders:', err);
    return res.status(500).json({ error: 'Unexpected server error.' });
  }
}