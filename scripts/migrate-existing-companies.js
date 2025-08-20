const mongoose = require('mongoose');
const Product = require('../src/models/Product');
require('dotenv').config();

const migrateExistingCompanies = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb+srv://haider099alikhan:KwCv78HaZh13c81p@cluster0.ylsuqzx.mongodb.net/boyzeta?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ Connected to MongoDB');

    // Find all existing companies
    const companies = await Product.find({});
    console.log(`📊 Found ${companies.length} companies to migrate`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const company of companies) {
      let needsUpdate = false;
      const updateData = {};

      console.log(`\n🔍 Checking company: ${company.name}`);
      console.log(`   Country field: ${JSON.stringify(company.country)}`);
      console.log(`   Country field type: ${typeof company.country}`);
      console.log(`   Has country property: ${'country' in company}`);

      // Add country field if missing
      if (!company.country || company.country === undefined) {
        updateData.country = 'GLOBAL';
        needsUpdate = true;
        console.log(`🔧 Company ${company.name} missing country field, will set to GLOBAL`);
      }

      // Convert old alternatives format to new format if needed
      if (company.alternatives && company.alternatives.length > 0) {
        const hasOldFormat = company.alternatives.some(alt => typeof alt === 'string');
        
        if (hasOldFormat) {
          updateData.alternatives = company.alternatives.map(alt => {
            if (typeof alt === 'string') {
              return {
                name: alt,
                countryCode: 'GLOBAL',
                description: ''
              };
            }
            return alt;
          });
          needsUpdate = true;
        }
      }

      console.log(`   Needs update: ${needsUpdate}`);
      if (needsUpdate) {
        console.log(`   Update data: ${JSON.stringify(updateData)}`);
      }

      // Update company if needed
      if (needsUpdate) {
        await Product.findByIdAndUpdate(company._id, updateData);
        updatedCount++;
        console.log(`✅ Updated company: ${company.name}`);
      } else {
        skippedCount++;
        console.log(`⏭️  Skipped company: ${company.name} (already up to date)`);
      }
    }

    console.log('\n🎉 Migration completed!');
    console.log(`📝 Updated: ${updatedCount} companies`);
    console.log(`⏭️  Skipped: ${skippedCount} companies`);
    console.log(`📊 Total: ${companies.length} companies`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
};

migrateExistingCompanies();
