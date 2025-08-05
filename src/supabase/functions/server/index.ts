import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js@2'
import * as kv from './kv_store.tsx'

const app = new Hono()

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

app.use('*', logger(console.log))

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

// Helper function to verify user authentication
async function verifyUser(request: Request) {
  const accessToken = request.headers.get('Authorization')?.split(' ')[1]
  if (!accessToken) {
    return { user: null, error: 'No authorization token provided' }
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    if (error || !user) {
      return { user: null, error: 'Invalid or expired token' }
    }
    return { user, error: null }
  } catch (err) {
    console.log('Auth verification error:', err)
    return { user: null, error: 'Authentication failed' }
  }
}

// User Registration
app.post('/make-server-838db481/auth/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json()

    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400)
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    })

    if (error) {
      console.log('User creation error:', error)
      return c.json({ error: error.message }, 400)
    }

    // Create user profile in KV store
    const userProfile = {
      id: data.user.id,
      name,
      email,
      member_since: new Date().toISOString(),
      saved_destinations: [],
      trip_history: [],
      reviews: []
    }

    await kv.set(`user:${data.user.id}`, userProfile)

    return c.json({ 
      message: 'User created successfully',
      user: {
        id: data.user.id,
        email: data.user.email,
        name
      }
    })
  } catch (err) {
    console.log('Signup error:', err)
    return c.json({ error: 'Internal server error during signup' }, 500)
  }
})

// Get User Profile
app.get('/make-server-838db481/user/profile', async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.raw)
    if (error || !user) {
      return c.json({ error: error || 'Unauthorized' }, 401)
    }

    const userProfile = await kv.get(`user:${user.id}`)
    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404)
    }

    return c.json({ profile: userProfile })
  } catch (err) {
    console.log('Get profile error:', err)
    return c.json({ error: 'Internal server error while fetching profile' }, 500)
  }
})

// Get All Destinations
app.get('/make-server-838db481/destinations', async (c) => {
  try {
    const destinations = await kv.getByPrefix('destination:')
    
    // If no destinations exist, create some sample data
    if (destinations.length === 0) {
      const sampleDestinations = [
        {
          id: '1',
          name: 'Santorini, Greece',
          description: 'Stunning sunsets and white-washed buildings overlooking the Aegean Sea',
          longDescription: 'Known for its spectacular sunsets, unique volcanic landscape, and charming architecture, Santorini is one of the most photographed destinations in the world. The island\'s capital, Fira, sits dramatically on the caldera edge, offering breathtaking views of the azure Aegean Sea.',
          images: [
            'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'
          ],
          rating: 4.9,
          reviews: 234,
          category: 'Romantic',
          region: 'Europe',
          duration: '5-7 days',
          price: 'From $299/night',
          highlights: [
            'Iconic blue-domed churches and white buildings',
            'World-famous sunsets in Oia village',
            'Ancient Akrotiri archaeological site',
            'Volcanic beaches with unique colored sand'
          ],
          bestTime: 'April to October',
          difficulty: 'Easy',
          groupSize: '2-15 people'
        },
        {
          id: '2',
          name: 'Kyoto, Japan',
          description: 'Ancient temples, traditional gardens, and authentic cultural experiences',
          longDescription: 'Kyoto, the former imperial capital of Japan, is a city that seamlessly blends ancient traditions with modern life. Home to over 2,000 temples and shrines, including the famous Fushimi Inari Shrine with its thousands of vermillion torii gates.',
          images: [
            'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&h=600&fit=crop'
          ],
          rating: 4.8,
          reviews: 456,
          category: 'Cultural',
          region: 'Asia',
          duration: '4-6 days',
          price: 'From $180/night',
          highlights: [
            'Over 2,000 temples and shrines',
            'Traditional geisha districts',
            'Authentic tea ceremony experiences',
            'Beautiful zen gardens'
          ],
          bestTime: 'March to May, September to November',
          difficulty: 'Easy',
          groupSize: '1-20 people'
        },
        {
          id: '3',
          name: 'Banff, Canada',
          description: 'Breathtaking mountain landscapes and pristine wilderness adventures',
          longDescription: 'Located in the heart of the Canadian Rockies, Banff National Park offers some of the most spectacular mountain scenery in North America. Crystal-clear lakes, towering peaks, and abundant wildlife make this a paradise for outdoor enthusiasts.',
          images: [
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop'
          ],
          rating: 4.7,
          reviews: 189,
          category: 'Adventure',
          region: 'North America',
          duration: '3-5 days',
          price: 'From $220/night',
          highlights: [
            'Lake Louise and Moraine Lake',
            'World-class hiking and skiing',
            'Wildlife viewing opportunities',
            'Stunning mountain vistas'
          ],
          bestTime: 'June to September, December to March',
          difficulty: 'Moderate',
          groupSize: '2-12 people'
        }
      ]

      // Store sample destinations
      for (const dest of sampleDestinations) {
        await kv.set(`destination:${dest.id}`, dest)
      }

      return c.json({ destinations: sampleDestinations })
    }

    return c.json({ destinations })
  } catch (err) {
    console.log('Get destinations error:', err)
    return c.json({ error: 'Internal server error while fetching destinations' }, 500)
  }
})

// Get Single Destination
app.get('/make-server-838db481/destinations/:id', async (c) => {
  try {
    const destinationId = c.req.param('id')
    const destination = await kv.get(`destination:${destinationId}`)
    
    if (!destination) {
      return c.json({ error: 'Destination not found' }, 404)
    }

    return c.json({ destination })
  } catch (err) {
    console.log('Get destination error:', err)
    return c.json({ error: 'Internal server error while fetching destination' }, 500)
  }
})

// Get Comments for Destination
app.get('/make-server-838db481/destinations/:id/comments', async (c) => {
  try {
    const destinationId = c.req.param('id')
    const comments = await kv.getByPrefix(`comment:${destinationId}:`)
    
    // Sort comments by creation date (newest first)
    const sortedComments = comments.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    return c.json({ comments: sortedComments })
  } catch (err) {
    console.log('Get comments error:', err)
    return c.json({ error: 'Internal server error while fetching comments' }, 500)
  }
})

// Add Comment (Requires Authentication)
app.post('/make-server-838db481/destinations/:id/comments', async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.raw)
    if (error || !user) {
      return c.json({ error: error || 'Unauthorized' }, 401)
    }

    const destinationId = c.req.param('id')
    const { comment, rating } = await c.req.json()

    if (!comment || !rating) {
      return c.json({ error: 'Comment and rating are required' }, 400)
    }

    // Get user profile for name
    const userProfile = await kv.get(`user:${user.id}`)
    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404)
    }

    const commentId = crypto.randomUUID()
    const newComment = {
      id: commentId,
      destination_id: destinationId,
      user_id: user.id,
      user_name: userProfile.name,
      comment,
      rating,
      created_at: new Date().toISOString()
    }

    await kv.set(`comment:${destinationId}:${commentId}`, newComment)

    return c.json({ 
      message: 'Comment added successfully',
      comment: newComment
    })
  } catch (err) {
    console.log('Add comment error:', err)
    return c.json({ error: 'Internal server error while adding comment' }, 500)
  }
})

// Save/Unsave Destination (Requires Authentication)
app.post('/make-server-838db481/user/destinations/:id/save', async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.raw)
    if (error || !user) {
      return c.json({ error: error || 'Unauthorized' }, 401)
    }

    const destinationId = c.req.param('id')
    const { action } = await c.req.json() // 'save' or 'unsave'

    const userProfile = await kv.get(`user:${user.id}`)
    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404)
    }

    let savedDestinations = userProfile.saved_destinations || []

    if (action === 'save') {
      if (!savedDestinations.includes(destinationId)) {
        savedDestinations.push(destinationId)
      }
    } else if (action === 'unsave') {
      savedDestinations = savedDestinations.filter(id => id !== destinationId)
    } else {
      return c.json({ error: 'Invalid action. Use "save" or "unsave"' }, 400)
    }

    userProfile.saved_destinations = savedDestinations
    await kv.set(`user:${user.id}`, userProfile)

    return c.json({ 
      message: `Destination ${action}d successfully`,
      saved_destinations: savedDestinations
    })
  } catch (err) {
    console.log('Save destination error:', err)
    return c.json({ error: 'Internal server error while saving destination' }, 500)
  }
})

// Get User's Saved Destinations (Requires Authentication)
app.get('/make-server-838db481/user/saved-destinations', async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.raw)
    if (error || !user) {
      return c.json({ error: error || 'Unauthorized' }, 401)
    }

    const userProfile = await kv.get(`user:${user.id}`)
    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404)
    }

    const savedDestinationIds = userProfile.saved_destinations || []
    const savedDestinations = []

    for (const destId of savedDestinationIds) {
      const destination = await kv.get(`destination:${destId}`)
      if (destination) {
        savedDestinations.push(destination)
      }
    }

    return c.json({ saved_destinations: savedDestinations })
  } catch (err) {
    console.log('Get saved destinations error:', err)
    return c.json({ error: 'Internal server error while fetching saved destinations' }, 500)
  }
})

// Health check
app.get('/make-server-838db481/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

Deno.serve(app.fetch)