const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../kys-frontend/src/modules/student/components/wizard/Step1Personal.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

// Add imports
if (!content.includes("import { State, City } from 'country-state-city'")) {
    content = content.replace("import { useState } from 'react'", "import { useState, useEffect } from 'react'\nimport { State, City } from 'country-state-city'");
}

// Year of Admission logic
const yearOfAdmissionTarget = `{field('Year of Admission', input('number', String(data.year_of_admission || ''), v => update({ year_of_admission: v ? Number(v) : null }), 'e.g. 2023'))}`;
const yearOfAdmissionReplacement = `{field('Year of Admission', select(
                        Array.from({ length: 20 }, (_, i) => String(2021 + i)),
                        data.year_of_admission ? String(data.year_of_admission) : '',
                        v => update({ year_of_admission: v ? Number(v) : null }),
                        'Select Year'
                    ))}`;
content = content.replace(yearOfAdmissionTarget, yearOfAdmissionReplacement);

// Category logic
const categoryTarget = `{field('Category *', select(['General', 'OBC', 'SC', 'ST', 'NT', 'EWS'], (pi.category as string) || '', v => upd('category', v), 'Select Category', getValidation('Category', 'personal_info.category')))}`;
const categoryReplacement = `{field('Category *', (
                        <div className="space-y-2">
                            {select(
                                ['General', 'OBC', 'SC', 'ST', 'NT', 'EWS', 'Other'],
                                (pi.category as string) && !['General', 'OBC', 'SC', 'ST', 'NT', 'EWS'].includes(pi.category as string) ? 'Other' : ((pi.category as string) || ''),
                                v => {
                                    if (v === 'Other') {
                                        upd('category', 'Other');
                                    } else {
                                        upd('category', v);
                                    }
                                },
                                'Select Category',
                                getValidation('Category', 'personal_info.category')
                            )}
                            {((pi.category as string) === 'Other' || ((pi.category as string) && !['General', 'OBC', 'SC', 'ST', 'NT', 'EWS', 'Other'].includes(pi.category as string))) && (
                                input('text', (pi.category as string) === 'Other' ? '' : (pi.category as string) || '', v => upd('category', v), 'Enter custom category', getValidation('Custom Category', 'personal_info.category'))
                            )}
                        </div>
                    ))}`;
content = content.replace(categoryTarget, categoryReplacement);

// Photo Upload logic
content = content.replace(`if (file.size > 2 * 1024 * 1024) {`, `if (file.size > 1 * 1024 * 1024) {`);
content = content.replace(`setUploadMsg('Image size must be less than 2MB.')`, `setUploadMsg('File size must be less than 1MB.')`);
content = content.replace(`accept="image/*"`, `accept="application/pdf"`);
content = content.replace(`<p>Supported formats: PNG, JPG, JPEG</p>`, `<p>Supported formats: PDF</p>`);
content = content.replace(`<p>Maximum file size: 2 MB</p>`, `<p>Maximum file size: 1 MB</p>`);

// Add required mark to Passport Size Photo
content = content.replace(
    `<label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-[#5f6f86]">Passport Size Photo</label>`, 
    `<label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-[#5f6f86]">Passport Size Photo *</label>`
);

// Add City, State, Pincode, DIGIPIN
const permanentAddressTarget = `{field('Permanent Address *', (
                    <div className="space-y-1">
                        <textarea`;

const injectBeforePermanentAddress = `
                <h3 className="mb-4 border-b border-[#c9d6ea] pb-2 text-2xl font-semibold text-[#223b60]">Location Details</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 mb-5">
                    {field('State *', select(
                        State.getStatesOfCountry('IN').map(s => s.name),
                        (pi.state as string) || '',
                        v => {
                            upd('state', v);
                            upd('city', '');
                            upd('pincode', '');
                        },
                        'Select State',
                        getValidation('State', 'personal_info.state')
                    ))}
                    
                    {field('City *', (() => {
                        const stateObj = State.getStatesOfCountry('IN').find(s => s.name === pi.state);
                        const cityList = stateObj ? City.getCitiesOfState('IN', stateObj.isoCode).map(c => c.name) : [];
                        const isCustom = (pi.city as string) && !cityList.includes(pi.city as string);
                        const selectedVal = isCustom || (pi.city === 'Other') ? 'Other' : ((pi.city as string) || '');
                        
                        return (
                            <div className="space-y-2">
                                {select(
                                    [...cityList, 'Other'],
                                    selectedVal,
                                    async v => {
                                        if (v === 'Other') {
                                            upd('city', 'Other');
                                        } else {
                                            upd('city', v);
                                            // auto fetch pincode
                                            try {
                                                const res = await fetch(\`https://api.postalpincode.in/postoffice/\${v}\`);
                                                const data = await res.json();
                                                if (data && data[0] && data[0].Status === 'Success') {
                                                    const postOffices = data[0].PostOffice;
                                                    if (postOffices && postOffices.length > 0) {
                                                        upd('pincode', postOffices[0].Pincode);
                                                    }
                                                }
                                            } catch (e) {
                                                console.error('Failed to fetch pincode', e);
                                            }
                                        }
                                    },
                                    'Select City',
                                    getValidation('City', 'personal_info.city')
                                )}
                                {(selectedVal === 'Other') && (
                                    input('text', (pi.city as string) === 'Other' ? '' : (pi.city as string) || '', v => upd('city', v), 'Enter custom city name', getValidation('Custom City', 'personal_info.city'))
                                )}
                            </div>
                        );
                    })())}

                    {field('Pincode *', input(
                        'text', 
                        (pi.pincode as string) || '', 
                        v => upd('pincode', v), 
                        'e.g. 110001', 
                        getValidation('Pincode', 'personal_info.pincode')
                    ))}

                    {field('DIGIPIN', input(
                        'text', 
                        (pi.digipin as string) || '', 
                        v => upd('digipin', v.toUpperCase()), 
                        '10-character alphanumeric', 
                        getValidation('DIGIPIN', 'personal_info.digipin')
                    ))}
                </div>
                
                {field('Permanent Address *', (
                    <div className="space-y-1">
                        <textarea`;

content = content.replace(permanentAddressTarget, injectBeforePermanentAddress);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Update successful');
