const { sequelize, Student, StudentPersonalInfo } = require('./models');

async function testPhotoFlow() {
    try {
        console.log('=== Testing Photo Flow ===\n');

        // Find a student with a photo
        const student = await Student.findOne({
            where: { id: 1685 },
            include: ['personal_info']
        });

        if (!student) {
            console.log('Student not found');
            return;
        }

        console.log('Student ID:', student.id);
        console.log('Student Name:', student.first_name, student.last_name);
        console.log('\nPersonal Info:');
        console.log('- photo_url:', student.personal_info?.photo_url);
        console.log('- photo_public_id:', student.personal_info?.photo_public_id);

        // Test serializeModel
        const { serializeModel } = require('./utils/helpers');
        const serialized = serializeModel(student.personal_info);
        console.log('\nSerialized personal_info:');
        console.log('- photo_url:', serialized?.photo_url);

        // Test decodeStudentProfilePayload
        const { decodeStudentProfilePayload } = require('./utils/profileCodec');
        const decoded = decodeStudentProfilePayload({
            id: student.id,
            personal_info: serialized,
        });
        console.log('\nDecoded payload:');
        console.log('- personal_info.photo_url:', decoded.personal_info?.photo_url);

        console.log('\n=== Test Complete ===');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

testPhotoFlow();
