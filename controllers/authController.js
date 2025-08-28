const supabase = require('../config/supabaseClient');
                                                                                                                                                                                                                                                                                                                                                                                                                                           

// Signup Controller
exports.signup = async (req, res) => {
  const { email, password, name } = req.body;
  const { data, error } = await supabase.auth.signUp({
    email, 
    password,
    options: {
      data: { display_name : name }
    }
  });

  if (error) return res.status(400).json({ error: error.message });

  if (data?.user?.identities?.length === 0) {
    return res.status(409).json({ error: 'User already registered with this email.' });
  }

  const userId = data.user.id;

  console.log(`this is signup ${data.user.id}`)
  console.log(`this is signup222 ${data.user}`)

  try {
    // Insert user
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        { id: userId, email: email, name: name, password: password },
      ])
      .select();
    if (userError) {
      console.error('Error inserting user:', userError);
      return res.status(500).json({ error: 'Failed to insert user data.' });
    }
    console.log('User inserted successfully in public users:', userData);

    // Create root folder
    const { data: folderData, error: folderError } = await supabase
      .from('folders')
      .insert([
        { name: 'root', owner_id: userId, parent_id: null }
      ])
      .select();
    if (folderError) {
      console.error('Error creating root folder:', folderError);
      return res.status(500).json({ error: 'Failed to create root folder.' });
    }
    console.log('Root folder created successfully:', folderData);

    return res.json({ message: 'Signup success. Verify your email.' });
  } catch (err) {
    console.error('Unexpected error in signup:', err);
    return res.status(500).json({ error: 'Unexpected server error.' });
  }
};

// Signin Controller
exports.signin = async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return res.status(401).json({ error: error.message });
  // res.cookie("access_token", data.session.access_token, {
  //   httpOnly:false , 
  //   secure: false, // true in prod with HTTPS
  //   sameSite: 'none',
  //   maxAge: 1000 * 60 * 60 * 24 * 30})
  return res.json({msg:"login success", token: data.session.access_token})
};

// Signout Controller (client-side should simply discard JWT, but for completeness:)
exports.signout = async (req, res) => {
  const { error } = await supabase.auth.signOut();
  if (error) return res.status(400).json({ error: error.message });
  return res.json({ message: 'Signout success' });
};
