import prisma from '@/lib/prisma'
import { hashPassword } from '@/lib/password'

async function main() {
  try {
    // Delete existing users
    await prisma.user.deleteMany({})

    // Create demo admin
    const adminPassword = await hashPassword('password123')
    const admin = await prisma.user.create({
      data: {
        email: 'admin@test.com',
        password: adminPassword,
        fullName: 'Admin Hệ Thống',
        phone: '0987654321',
        role: 'admin',
        isActive: true,
      },
    })

    // Create demo staff
    const staffPassword = await hashPassword('password123')
    const staff = await prisma.user.create({
      data: {
        email: 'teacher@test.com',
        password: staffPassword,
        fullName: 'Nguyễn Văn A (Giáo Viên)',
        phone: '0987654322',
        role: 'staff',
        isActive: true,
      },
    })

    // Create staff profile
    await prisma.staff.create({
      data: {
        userId: staff.id,
        position: 'Giáo viên',
        department: 'Tiếng Anh',
      },
    })

    // Create demo student
    const studentPassword = await hashPassword('password123')
    const student = await prisma.user.create({
      data: {
        email: 'student@test.com',
        password: studentPassword,
        fullName: 'Trần Thị B (Học Viên)',
        phone: '0987654323',
        role: 'student',
        isActive: true,
      },
    })

    // Create student profile
    await prisma.student.create({
      data: {
        userId: student.id,
        fullName: 'Trần Thị B',
        email: 'student@test.com',
        level: 'B1',
        parentEmail: 'parent@test.com',
        parentPhone: '0987654324',
      },
    })

    console.log('✅ Seed completed successfully!')
    console.log('\nDemo Accounts:')
    console.log('Admin: admin@test.com / password123')
    console.log('Teacher: teacher@test.com / password123')
    console.log('Student: student@test.com / password123')
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
