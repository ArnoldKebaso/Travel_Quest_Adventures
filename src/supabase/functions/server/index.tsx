import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js'
import * as kv from './kv_store.tsx'

const app = new Hono()

// CORS configuration
app.use('*', cors({
  origin: '*',
  allowHeaders: ['*'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}))

app.use('*', logger(console.log))

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

// Helper function to verify user authentication
async function verifyUser(request: Request) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  
  const token = authHeader.split(' ')[1]
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) {
      console.log('Auth error:', error)
      return null
    }
    return user
  } catch (error) {
    console.log('Token verification error:', error)
    return null
  }
}

// Destinations routes
app.get('/make-server-838db481/destinations', async (c) => {
  try {
    const destinations = await kv.get('destinations') || []
    return c.json({ destinations })
  } catch (error) {
    console.log('Error fetching destinations:', error)
    return c.json({ error: 'Failed to fetch destinations' }, 500)
  }
})

app.get('/make-server-838db481/destinations/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const destinations = await kv.get('destinations') || []
    const destination = destinations.find((d: any) => d.id === id)
    
    if (!destination) {
      return c.json({ error: 'Destination not found' }, 404)
    }
    
    return c.json({ destination })
  } catch (error) {
    console.log('Error fetching destination:', error)
    return c.json({ error: 'Failed to fetch destination' }, 500)
  }
})

// Comments routes
app.get('/make-server-838db481/destinations/:id/comments', async (c) => {
  try {
    const destinationId = c.req.param('id')
    const allComments = await kv.get(`comments_${destinationId}`) || []
    
    // Try to get user info (optional for this endpoint)
    const user = await verifyUser(c.req.raw)
    let filteredComments = []
    
    if (user) {
      // Check if user has visited this destination
      const bookings = await kv.get(`bookings_${user.id}`) || []
      const hasVisited = bookings.some((booking: any) => 
        booking.destinationId === destinationId && 
        booking.canReview === true &&
        new Date(booking.checkOut) < new Date()
      )
      
      if (hasVisited) {
        // Show all comments if user has visited
        filteredComments = allComments
      } else {
        // Show only other users' comments if user hasn't visited
        filteredComments = allComments.filter((comment: any) => comment.userId !== user.id)
      }
    } else {
      // Show all comments for non-authenticated users
      filteredComments = allComments
    }
    
    return c.json({ comments: filteredComments })
  } catch (error) {
    console.log('Error fetching comments:', error)
    return c.json({ error: 'Failed to fetch comments' }, 500)
  }
})

app.post('/make-server-838db481/destinations/:id/comments', async (c) => {
  try {
    const user = await verifyUser(c.req.raw)
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const destinationId = c.req.param('id')
    const { comment, rating } = await c.req.json()
    
    if (!comment || comment.trim() === '') {
      return c.json({ error: 'Comment text is required' }, 400)
    }

    // Check if user has visited this destination
    const bookings = await kv.get(`bookings_${user.id}`) || []
    const hasVisited = bookings.some((booking: any) => 
      booking.destinationId === destinationId && 
      booking.canReview === true &&
      new Date(booking.checkOut) < new Date()
    )

    if (!hasVisited) {
      return c.json({ error: 'You can only leave reviews for destinations you have visited through TravelQuest' }, 403)
    }

    const comments = await kv.get(`comments_${destinationId}`) || []
    
    // Check if user already reviewed this destination
    const existingComment = comments.find((c: any) => c.userId === user.id)
    if (existingComment) {
      return c.json({ error: 'You have already reviewed this destination' }, 400)
    }

    const newComment = {
      id: crypto.randomUUID(),
      userId: user.id,
      userName: user.user_metadata?.name || user.email,
      userAvatar: user.user_metadata?.avatar_url || null,
      comment: comment.trim(),
      rating: rating || null,
      date: new Date().toISOString(),
      createdAt: Date.now()
    }

    comments.push(newComment)
    await kv.set(`comments_${destinationId}`, comments)

    // Update user profile review count
    const profile = await kv.get(`profile_${user.id}`) || {}
    profile.reviewsCount = (profile.reviewsCount || 0) + 1
    await kv.set(`profile_${user.id}`, profile)
    
    return c.json({ comment: newComment })
  } catch (error) {
    console.log('Error adding comment:', error)
    return c.json({ error: 'Failed to add comment' }, 500)
  }
})

// User saved destinations
app.get('/make-server-838db481/user/saved', async (c) => {
  try {
    const user = await verifyUser(c.req.raw)
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const saved = await kv.get(`saved_${user.id}`) || []
    return c.json({ saved })
  } catch (error) {
    console.log('Error fetching saved destinations:', error)
    return c.json({ error: 'Failed to fetch saved destinations' }, 500)
  }
})

app.post('/make-server-838db481/user/saved/:id', async (c) => {
  try {
    const user = await verifyUser(c.req.raw)
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const destinationId = c.req.param('id')
    const saved = await kv.get(`saved_${user.id}`) || []
    
    if (!saved.includes(destinationId)) {
      saved.push(destinationId)
      await kv.set(`saved_${user.id}`, saved)
    }
    
    return c.json({ saved })
  } catch (error) {
    console.log('Error saving destination:', error)
    return c.json({ error: 'Failed to save destination' }, 500)
  }
})

app.delete('/make-server-838db481/user/saved/:id', async (c) => {
  try {
    const user = await verifyUser(c.req.raw)
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const destinationId = c.req.param('id')
    const saved = await kv.get(`saved_${user.id}`) || []
    const filtered = saved.filter((id: string) => id !== destinationId)
    
    await kv.set(`saved_${user.id}`, filtered)
    return c.json({ saved: filtered })
  } catch (error) {
    console.log('Error removing saved destination:', error)
    return c.json({ error: 'Failed to remove saved destination' }, 500)
  }
})

// User profile routes
app.get('/make-server-838db481/user/profile', async (c) => {
  try {
    const user = await verifyUser(c.req.raw)
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const profile = await kv.get(`profile_${user.id}`) || {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || '',
      memberSince: new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      totalTrips: 0,
      reviewsCount: 0
    }
    
    return c.json({ profile })
  } catch (error) {
    console.log('Error fetching profile:', error)
    return c.json({ error: 'Failed to fetch profile' }, 500)
  }
})

// Trip booking routes
app.post('/make-server-838db481/destinations/:id/book', async (c) => {
  try {
    const user = await verifyUser(c.req.raw)
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const destinationId = c.req.param('id')
    const { checkIn, checkOut, guests } = await c.req.json()
    
    if (!checkIn || !checkOut || !guests) {
      return c.json({ error: 'Check-in date, check-out date, and number of guests are required' }, 400)
    }

    // Get destination details
    const destinations = await kv.get('destinations') || []
    const destination = destinations.find((d: any) => d.id === destinationId)
    
    if (!destination) {
      return c.json({ error: 'Destination not found' }, 404)
    }

    // Create booking
    const booking = {
      id: crypto.randomUUID(),
      userId: user.id,
      destinationId,
      destinationName: destination.name,
      destinationImage: destination.images[0],
      checkIn,
      checkOut,
      guests: parseInt(guests),
      status: 'confirmed',
      bookingDate: new Date().toISOString(),
      totalPrice: destination.price,
      canReview: false // Will be set to true after the trip is completed
    }

    // Save booking
    const userBookings = await kv.get(`bookings_${user.id}`) || []
    userBookings.push(booking)
    await kv.set(`bookings_${user.id}`, userBookings)

    // Update user profile trip count
    const profile = await kv.get(`profile_${user.id}`) || {}
    profile.totalTrips = (profile.totalTrips || 0) + 1
    await kv.set(`profile_${user.id}`, profile)

    return c.json({ booking, message: 'Trip booked successfully!' })
  } catch (error) {
    console.log('Error booking trip:', error)
    return c.json({ error: 'Failed to book trip' }, 500)
  }
})

// Get user bookings
app.get('/make-server-838db481/user/bookings', async (c) => {
  try {
    const user = await verifyUser(c.req.raw)
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const bookings = await kv.get(`bookings_${user.id}`) || []
    
    // Mark past trips as reviewable
    const now = new Date()
    const updatedBookings = bookings.map((booking: any) => {
      const checkOutDate = new Date(booking.checkOut)
      if (checkOutDate < now && booking.status === 'confirmed') {
        return { ...booking, canReview: true }
      }
      return booking
    })

    // Save updated bookings if any changed
    if (JSON.stringify(bookings) !== JSON.stringify(updatedBookings)) {
      await kv.set(`bookings_${user.id}`, updatedBookings)
    }

    return c.json({ bookings: updatedBookings })
  } catch (error) {
    console.log('Error fetching bookings:', error)
    return c.json({ error: 'Failed to fetch bookings' }, 500)
  }
})

// Check if user has visited a destination
app.get('/make-server-838db481/user/visited/:id', async (c) => {
  try {
    const user = await verifyUser(c.req.raw)
    if (!user) {
      return c.json({ hasVisited: false })
    }

    const destinationId = c.req.param('id')
    const bookings = await kv.get(`bookings_${user.id}`) || []
    
    const hasVisited = bookings.some((booking: any) => 
      booking.destinationId === destinationId && 
      booking.canReview === true &&
      new Date(booking.checkOut) < new Date()
    )

    return c.json({ hasVisited })
  } catch (error) {
    console.log('Error checking visit status:', error)
    return c.json({ hasVisited: false })
  }
})

// User signup route
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
      // Automatically confirm the user's email since an email server hasn't been configured
      email_confirm: true
    })

    if (error) {
      console.log('Signup error:', error)
      return c.json({ error: error.message }, 400)
    }

    // Initialize user profile
    const profile = {
      id: data.user.id,
      email: data.user.email,
      name,
      memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      totalTrips: 0,
      reviewsCount: 0
    }
    
    await kv.set(`profile_${data.user.id}`, profile)

    return c.json({ 
      user: data.user,
      message: 'Account created successfully' 
    })
  } catch (error) {
    console.log('Signup error:', error)
    return c.json({ error: 'Failed to create account' }, 500)
  }
})

// Initialize sample data
app.post('/make-server-838db481/init-data', async (c) => {
  try {
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
          'Iconic blue-domed churches',
          'World-famous sunsets in Oia',
          'Volcanic beaches',
          'Traditional wineries'
        ],
        bestTime: 'April to October',
        difficulty: 'Easy'
      },
      {
        id: '2',
        name: 'Kyoto, Japan',
        description: 'Ancient temples, traditional gardens, and authentic cultural experiences',
        longDescription: 'Former imperial capital of Japan, Kyoto is home to over 2,000 temples and shrines. Experience traditional Japanese culture through tea ceremonies, geisha districts, and beautiful bamboo forests.',
        images: [
          'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&h=600&fit=crop'
        ],
        rating: 4.8,
        reviews: 456,
        category: 'Cultural',
        region: 'Asia',
        duration: '4-6 days',
        price: 'From $180/night',
        highlights: [
          'Historic temples and shrines',
          'Bamboo groves',
          'Traditional geisha districts',
          'Japanese gardens'
        ],
        bestTime: 'March to May, October to November',
        difficulty: 'Easy'
      },
      {
        id: '3',
        name: 'Banff, Canada',
        description: 'Breathtaking mountain landscapes and pristine wilderness adventures',
        longDescription: 'Located in the Canadian Rockies, Banff National Park offers some of the most spectacular mountain scenery in the world. Perfect for hiking, wildlife watching, and outdoor adventures.',
        images: [
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'
        ],
        rating: 4.7,
        reviews: 189,
        category: 'Adventure',
        region: 'North America',
        duration: '3-5 days',
        price: 'From $220/night',
        highlights: [
          'Lake Louise',
          'Moraine Lake',
          'Hiking trails',
          'Wildlife viewing'
        ],
        bestTime: 'June to September',
        difficulty: 'Moderate'
      }
    ]

    await kv.set('destinations', sampleDestinations)
    return c.json({ message: 'Sample data initialized successfully' })
  } catch (error) {
    console.log('Error initializing data:', error)
    return c.json({ error: 'Failed to initialize data' }, 500)
  }
})

serve(app.fetch)