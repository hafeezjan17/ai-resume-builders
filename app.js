// Resume Builder Application
class ResumeBuilder {
    constructor() {
        this.currentStep = 0;
        this.totalSteps = 4;
        this.resumeData = {
            personalInfo: {
                fullName: '',
                email: '',
                phone: '',
                address: '',
                linkedin: '',
                portfolio: '',
                summary: ''
            },
            education: [{
                degree: '',
                institution: '',
                graduationDate: '',
                gpa: '',
                coursework: ''
            }],
            projects: [{
                name: '',
                description: '',
                technologies: '',
                link: '',
                duration: ''
            }],
            skills: {
                technical: [],
                soft: [],
                languages: [{name: '', proficiency: ''}]
            }
        };
        this.currentTemplate = 'modern-minimalist';
        this.templates = {
            'modern-minimalist': {
                name: 'Modern Minimalist',
                colors: {
                    primary: '#2563eb',
                    background: '#ffffff',
                    text: '#1f2937',
                    accent: '#3b82f6'
                }
            },
            'executive-dark': {
                name: 'Executive Dark',
                colors: {
                    primary: '#d97706',
                    background: '#1f2937',
                    text: '#f9fafb',
                    accent: '#fbbf24'
                }
            },
            'creative-gradient': {
                name: 'Creative Gradient',
                colors: {
                    primary: '#8b5cf6',
                    background: '#f8fafc',
                    text: '#1e293b',
                    accent: '#a855f7'
                }
            },
            'ats-friendly': {
                name: 'ATS-Friendly',
                colors: {
                    primary: '#000000',
                    background: '#ffffff',
                    text: '#000000',
                    accent: '#374151'
                }
            }
        };
        
        this.init();
    }

    init() {
        // Add a delay to ensure DOM is fully loaded
        setTimeout(() => {
            this.bindEvents();
            this.updateProgress();
            this.updatePreview();
            this.updateFormStep();
        }, 100);
    }

    bindEvents() {
        try {
            // Landing page
            const getStartedBtn = document.getElementById('get-started-btn');
            if (getStartedBtn) {
                getStartedBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('Get started button clicked');
                    this.showPage('builder-page');
                });
            }

            // Form navigation
            const nextBtn = document.getElementById('next-btn');
            const prevBtn = document.getElementById('prev-btn');
            const completeBtn = document.getElementById('complete-btn');
            const previewBtn = document.getElementById('preview-btn');

            if (nextBtn) {
                nextBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('Next button clicked');
                    this.nextStep();
                });
            }
            
            if (prevBtn) {
                prevBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('Previous button clicked');
                    this.prevStep();
                });
            }
            
            if (completeBtn) {
                completeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('Complete button clicked');
                    this.completeResume();
                });
            }
            
            if (previewBtn) {
                previewBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('Preview button clicked');
                    this.showPreviewModal();
                });
            }

            // Template selectors
            const templateSelector = document.getElementById('template-selector');
            const modalTemplateSelector = document.getElementById('modal-template-selector');
            
            if (templateSelector) {
                templateSelector.addEventListener('change', (e) => {
                    console.log('Template changed to:', e.target.value);
                    this.changeTemplate(e.target.value);
                });
            }
            
            if (modalTemplateSelector) {
                modalTemplateSelector.addEventListener('change', (e) => {
                    console.log('Modal template changed to:', e.target.value);
                    this.changeTemplate(e.target.value);
                });
            }

            // Modal controls
            const closeModalBtn = document.getElementById('close-modal-btn');
            const downloadHtmlBtn = document.getElementById('download-html-btn');
            const downloadPdfBtn = document.getElementById('download-pdf-btn');

            if (closeModalBtn) {
                closeModalBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.hidePreviewModal();
                });
            }
            
            if (downloadHtmlBtn) {
                downloadHtmlBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.downloadResume('html');
                });
            }
            
            if (downloadPdfBtn) {
                downloadPdfBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.downloadResume('pdf');
                });
            }

            // Success page actions
            const finalDownloadBtn = document.getElementById('final-download-btn');
            const startNewBtn = document.getElementById('start-new-btn');

            if (finalDownloadBtn) {
                finalDownloadBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showPreviewModal();
                });
            }
            
            if (startNewBtn) {
                startNewBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.startNew();
                });
            }

            // Form input listeners
            const form = document.getElementById('resume-form');
            if (form) {
                form.addEventListener('input', (e) => {
                    console.log('Form input changed:', e.target.name, e.target.value);
                    this.handleFormInput(e);
                });
                form.addEventListener('change', (e) => {
                    console.log('Form change event:', e.target.name, e.target.value);
                    this.handleFormInput(e);
                });
            }

            // Modal background click
            const modal = document.getElementById('preview-modal');
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        this.hidePreviewModal();
                    }
                });
            }

            // Step indicators click
            const stepIndicators = document.querySelectorAll('.step');
            stepIndicators.forEach((step, index) => {
                step.addEventListener('click', () => {
                    console.log('Step indicator clicked:', index);
                    if (index <= this.currentStep || this.validateStepsUpTo(index)) {
                        this.currentStep = index;
                        this.updateFormStep();
                        this.updateProgress();
                        this.updatePreview();
                    }
                });
            });

            console.log('All event listeners bound successfully');
        } catch (error) {
            console.error('Error binding events:', error);
        }
    }

    showPage(pageId) {
        console.log('Showing page:', pageId);
        try {
            // Hide all pages
            const pages = document.querySelectorAll('.page');
            pages.forEach(page => page.classList.remove('active'));

            // Show target page
            const targetPage = document.getElementById(pageId);
            if (targetPage) {
                targetPage.classList.add('active');
                console.log('Page shown successfully:', pageId);
            } else {
                console.error('Page not found:', pageId);
            }
        } catch (error) {
            console.error('Error showing page:', error);
        }
    }

    validateStepsUpTo(targetStep) {
        for (let i = 0; i <= targetStep; i++) {
            if (!this.validateStep(i)) {
                return false;
            }
        }
        return true;
    }

    validateStep(stepIndex) {
        const stepElement = document.querySelector(`.form-step[data-step="${stepIndex}"]`);
        if (!stepElement) return true;
        
        const requiredFields = stepElement.querySelectorAll('[required]');
        for (let field of requiredFields) {
            if (!field.value.trim()) {
                return false;
            }
        }
        return true;
    }

    nextStep() {
        console.log('Attempting to go to next step. Current:', this.currentStep);
        if (this.validateCurrentStep()) {
            if (this.currentStep < this.totalSteps - 1) {
                this.currentStep++;
                console.log('Moving to step:', this.currentStep);
                this.updateFormStep();
                this.updateProgress();
                this.collectFormData();
                this.updatePreview();
            } else {
                console.log('Already at last step');
            }
        } else {
            console.log('Validation failed for current step');
        }
    }

    prevStep() {
        console.log('Going to previous step. Current:', this.currentStep);
        if (this.currentStep > 0) {
            this.currentStep--;
            this.updateFormStep();
            this.updateProgress();
            this.collectFormData();
            this.updatePreview();
        }
    }

    validateCurrentStep() {
        const currentStepElement = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
        if (!currentStepElement) {
            console.log('No step element found for step:', this.currentStep);
            return true;
        }

        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;

        console.log('Validating', requiredFields.length, 'required fields');

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
                console.log('Field validation failed:', field.name);
                
                // Remove error class after user starts typing
                field.addEventListener('input', () => {
                    field.classList.remove('error');
                }, { once: true });
            } else {
                field.classList.remove('error');
            }
        });

        if (!isValid) {
            this.showNotification('Please fill in all required fields.', 'error');
        }

        return isValid;
    }

    updateFormStep() {
        console.log('Updating form step to:', this.currentStep);
        try {
            // Hide all steps
            const steps = document.querySelectorAll('.form-step');
            steps.forEach(step => {
                step.classList.remove('active');
                step.style.display = 'none';
            });

            // Show current step
            const currentStepElement = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
            if (currentStepElement) {
                currentStepElement.classList.add('active');
                currentStepElement.style.display = 'block';
                console.log('Step element shown:', this.currentStep);
            } else {
                console.error('Step element not found for step:', this.currentStep);
            }

            // Update step indicators
            const stepIndicators = document.querySelectorAll('.step');
            stepIndicators.forEach((step, index) => {
                step.classList.remove('active', 'completed');
                if (index === this.currentStep) {
                    step.classList.add('active');
                } else if (index < this.currentStep) {
                    step.classList.add('completed');
                }
            });

            // Update navigation buttons
            this.updateNavigationButtons();
            this.updateSectionInfo();
        } catch (error) {
            console.error('Error updating form step:', error);
        }
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const completeBtn = document.getElementById('complete-btn');

        if (prevBtn) {
            prevBtn.style.display = this.currentStep === 0 ? 'none' : 'inline-flex';
        }

        if (this.currentStep === this.totalSteps - 1) {
            if (nextBtn) nextBtn.style.display = 'none';
            if (completeBtn) completeBtn.style.display = 'inline-flex';
        } else {
            if (nextBtn) nextBtn.style.display = 'inline-flex';
            if (completeBtn) completeBtn.style.display = 'none';
        }
    }

    updateSectionInfo() {
        const sectionTitles = [
            'Personal Information',
            'Education',
            'Projects',
            'Skills'
        ];
        const sectionDescriptions = [
            'Tell us about yourself to get started',
            'Add your educational background',
            'Showcase your best projects',
            'List your technical and soft skills'
        ];

        const titleElement = document.getElementById('section-title');
        const descriptionElement = document.getElementById('section-description');

        if (titleElement) titleElement.textContent = sectionTitles[this.currentStep];
        if (descriptionElement) descriptionElement.textContent = sectionDescriptions[this.currentStep];
    }

    updateProgress() {
        const progressFill = document.getElementById('progress-fill');
        const progressPercentage = ((this.currentStep + 1) / this.totalSteps) * 100;
        
        if (progressFill) {
            progressFill.style.width = `${progressPercentage}%`;
        }
    }

    handleFormInput(e) {
        // Debounce the input handling to avoid too many updates
        clearTimeout(this.inputTimeout);
        this.inputTimeout = setTimeout(() => {
            this.collectFormData();
            this.updatePreview();
        }, 300);
    }

    collectFormData() {
        console.log('Collecting form data...');
        try {
            // Personal Info
            const personalFields = ['fullName', 'email', 'phone', 'address', 'linkedin', 'portfolio', 'summary'];
            personalFields.forEach(field => {
                const input = document.querySelector(`[name="${field}"]`);
                if (input) {
                    this.resumeData.personalInfo[field] = input.value;
                }
            });

            // Education
            this.resumeData.education = [];
            const educationEntries = document.querySelectorAll('.education-entry');
            educationEntries.forEach(entry => {
                const education = {};
                const fields = ['degree', 'institution', 'graduationDate', 'gpa', 'coursework'];
                fields.forEach(field => {
                    const input = entry.querySelector(`[name="${field}"]`);
                    education[field] = input ? input.value : '';
                });
                this.resumeData.education.push(education);
            });

            // Projects
            this.resumeData.projects = [];
            const projectEntries = document.querySelectorAll('.project-entry');
            projectEntries.forEach(entry => {
                const project = {};
                const fields = ['name', 'description', 'technologies', 'link', 'duration'];
                fields.forEach(field => {
                    const input = entry.querySelector(`[name="${field}"]`);
                    project[field] = input ? input.value : '';
                });
                this.resumeData.projects.push(project);
            });

            // Skills
            const technicalInput = document.querySelector('[name="technical"]');
            const softInput = document.querySelector('[name="soft"]');
            
            if (technicalInput) {
                this.resumeData.skills.technical = technicalInput.value.split(',').map(s => s.trim()).filter(s => s);
            }
            if (softInput) {
                this.resumeData.skills.soft = softInput.value.split(',').map(s => s.trim()).filter(s => s);
            }

            // Languages
            this.resumeData.skills.languages = [];
            const languageEntries = document.querySelectorAll('.language-entry');
            languageEntries.forEach(entry => {
                const nameInput = entry.querySelector('[name="languageName"]');
                const proficiencyInput = entry.querySelector('[name="languageProficiency"]');
                if (nameInput && nameInput.value.trim()) {
                    this.resumeData.skills.languages.push({
                        name: nameInput.value.trim(),
                        proficiency: proficiencyInput ? proficiencyInput.value : ''
                    });
                }
            });

            console.log('Form data collected:', this.resumeData);
        } catch (error) {
            console.error('Error collecting form data:', error);
        }
    }

    changeTemplate(templateId) {
        console.log('Changing template to:', templateId);
        this.currentTemplate = templateId;
        const selectors = [
            document.getElementById('template-selector'),
            document.getElementById('modal-template-selector')
        ];
        
        selectors.forEach(selector => {
            if (selector && selector.value !== templateId) {
                selector.value = templateId;
            }
        });

        this.updatePreview();
    }

    updatePreview() {
        console.log('Updating preview with template:', this.currentTemplate);
        const previewContainer = document.getElementById('resume-preview');
        const modalPreviewContainer = document.getElementById('modal-resume-preview');
        
        const resumeHTML = this.generateResumeHTML();
        
        if (previewContainer) {
            previewContainer.innerHTML = resumeHTML;
        }
        if (modalPreviewContainer) {
            modalPreviewContainer.innerHTML = resumeHTML;
        }
    }

    generateResumeHTML() {
        const data = this.resumeData;
        const templateClass = `template-${this.currentTemplate}`;

        return `
            <div class="resume-template ${templateClass}">
                <div class="resume-header">
                    <h1 class="resume-name">${data.personalInfo.fullName || 'Your Name'}</h1>
                    <div class="resume-contact">
                        ${data.personalInfo.email ? `<span><i class="fas fa-envelope"></i> ${data.personalInfo.email}</span>` : ''}
                        ${data.personalInfo.phone ? `<span><i class="fas fa-phone"></i> ${data.personalInfo.phone}</span>` : ''}
                        ${data.personalInfo.address ? `<span><i class="fas fa-map-marker-alt"></i> ${data.personalInfo.address}</span>` : ''}
                        ${data.personalInfo.linkedin ? `<span><i class="fab fa-linkedin"></i> ${data.personalInfo.linkedin}</span>` : ''}
                        ${data.personalInfo.portfolio ? `<span><i class="fas fa-globe"></i> ${data.personalInfo.portfolio}</span>` : ''}
                    </div>
                </div>

                ${data.personalInfo.summary ? `
                    <div class="resume-section">
                        <h2 class="resume-section-title">Professional Summary</h2>
                        <p>${data.personalInfo.summary}</p>
                    </div>
                ` : ''}

                ${data.education.length && data.education[0].degree ? `
                    <div class="resume-section">
                        <h2 class="resume-section-title">Education</h2>
                        ${data.education.map(edu => edu.degree ? `
                            <div class="resume-item">
                                <div class="resume-item-header">
                                    <div>
                                        <div class="resume-item-title">${edu.degree}</div>
                                        <div class="resume-item-subtitle">${edu.institution}</div>
                                        ${edu.gpa ? `<div class="resume-item-subtitle">GPA: ${edu.gpa}</div>` : ''}
                                    </div>
                                    <div class="resume-item-date">${edu.graduationDate}</div>
                                </div>
                                ${edu.coursework ? `<p><strong>Relevant Coursework:</strong> ${edu.coursework}</p>` : ''}
                            </div>
                        ` : '').join('')}
                    </div>
                ` : ''}

                ${data.projects.length && data.projects[0].name ? `
                    <div class="resume-section">
                        <h2 class="resume-section-title">Projects</h2>
                        ${data.projects.map(project => project.name ? `
                            <div class="resume-item">
                                <div class="resume-item-header">
                                    <div>
                                        <div class="resume-item-title">${project.name}</div>
                                        ${project.link ? `<div class="resume-item-subtitle"><a href="${project.link}" target="_blank">${project.link}</a></div>` : ''}
                                    </div>
                                    ${project.duration ? `<div class="resume-item-date">${project.duration}</div>` : ''}
                                </div>
                                ${project.description ? `<p>${project.description}</p>` : ''}
                                ${project.technologies ? `<p><strong>Technologies:</strong> ${project.technologies}</p>` : ''}
                            </div>
                        ` : '').join('')}
                    </div>
                ` : ''}

                ${(data.skills.technical.length || data.skills.soft.length || data.skills.languages.length) ? `
                    <div class="resume-section">
                        <h2 class="resume-section-title">Skills</h2>
                        ${data.skills.technical.length ? `
                            <div class="skills-subsection">
                                <h4>Technical Skills</h4>
                                <div class="skills-grid">
                                    ${data.skills.technical.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                                </div>
                            </div>
                        ` : ''}
                        ${data.skills.soft.length ? `
                            <div class="skills-subsection">
                                <h4>Soft Skills</h4>
                                <div class="skills-grid">
                                    ${data.skills.soft.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                                </div>
                            </div>
                        ` : ''}
                        ${data.skills.languages.length && data.skills.languages[0].name ? `
                            <div class="skills-subsection">
                                <h4>Languages</h4>
                                <div class="languages-list">
                                    ${data.skills.languages.map(lang => lang.name ? `
                                        <span class="language-item">${lang.name}${lang.proficiency ? ` (${lang.proficiency})` : ''}</span>
                                    ` : '').join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                ` : ''}
            </div>
        `;
    }

    showPreviewModal() {
        console.log('Showing preview modal');
        this.collectFormData();
        const modal = document.getElementById('preview-modal');
        if (modal) {
            modal.classList.remove('hidden');
            this.updatePreview();
        }
    }

    hidePreviewModal() {
        const modal = document.getElementById('preview-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    downloadResume(format) {
        this.collectFormData();
        const resumeHTML = this.generateResumeHTML();
        const fullHTML = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Resume - ${this.resumeData.personalInfo.fullName || 'Resume'}</title>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
                <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
                <style>
                    body { font-family: 'Inter', sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
                    .resume-template { max-width: 800px; margin: 0 auto; padding: 40px; }
                    ${this.getTemplateCSS()}
                </style>
            </head>
            <body>
                ${resumeHTML}
            </body>
            </html>
        `;

        if (format === 'html') {
            this.downloadFile(fullHTML, `${this.resumeData.personalInfo.fullName || 'resume'}.html`, 'text/html');
        } else if (format === 'pdf') {
            // Simulate PDF download (in a real app, you'd use a PDF generation library)
            this.showNotification('PDF download initiated! In a real application, this would generate a PDF file.', 'success');
            // For demo purposes, we'll download the HTML version
            this.downloadFile(fullHTML, `${this.resumeData.personalInfo.fullName || 'resume'}.html`, 'text/html');
        }
    }

    getTemplateCSS() {
        return `
            .resume-template { line-height: 1.6; }
            .resume-header { margin-bottom: 24px; }
            .resume-name { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
            .resume-contact { display: flex; flex-wrap: wrap; gap: 12px; font-size: 14px; margin-bottom: 16px; }
            .resume-section { margin-bottom: 24px; }
            .resume-section-title { font-size: 18px; font-weight: 600; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid; }
            .resume-item { margin-bottom: 16px; }
            .resume-item-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px; }
            .resume-item-title { font-weight: 600; }
            .resume-item-subtitle { color: #666; font-size: 14px; }
            .resume-item-date { font-size: 14px; color: #666; }
            .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 8px; margin: 12px 0; }
            .skill-tag { padding: 4px 8px; border-radius: 4px; font-size: 14px; text-align: center; }
            .languages-list { display: flex; flex-wrap: wrap; gap: 16px; }
            .language-item { font-size: 14px; }
            .skills-subsection { margin-bottom: 16px; }
            .skills-subsection h4 { margin: 8px 0; }
            
            .template-modern-minimalist { color: #1f2937; background: #ffffff; }
            .template-modern-minimalist .resume-section-title { border-color: #2563eb; color: #2563eb; }
            .template-modern-minimalist .skill-tag { background: rgba(37, 99, 235, 0.1); color: #2563eb; }
            
            .template-executive-dark { color: #f9fafb; background: #1f2937; padding: 16px; border-radius: 8px; }
            .template-executive-dark .resume-section-title { border-color: #fbbf24; color: #fbbf24; }
            .template-executive-dark .skill-tag { background: rgba(251, 191, 36, 0.2); color: #fbbf24; }
            
            .template-creative-gradient { color: #1e293b; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 16px; border-radius: 8px; }
            .template-creative-gradient .resume-section-title { border-color: #8b5cf6; color: #8b5cf6; }
            .template-creative-gradient .skill-tag { background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.1)); color: #8b5cf6; }
            
            .template-ats-friendly { color: #000000; background: #ffffff; font-family: 'Times New Roman', serif; }
            .template-ats-friendly .resume-section-title { border-color: #374151; color: #000000; font-family: 'Times New Roman', serif; }
            .template-ats-friendly .skill-tag { background: #f3f4f6; color: #374151; }
        `;
    }

    downloadFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        this.showNotification(`${filename} downloaded successfully!`, 'success');
    }

    completeResume() {
        if (this.validateCurrentStep()) {
            this.collectFormData();
            this.showPage('success-page');
        }
    }

    startNew() {
        // Reset all data
        this.currentStep = 0;
        this.resumeData = {
            personalInfo: {
                fullName: '', email: '', phone: '', address: '', linkedin: '', portfolio: '', summary: ''
            },
            education: [{ degree: '', institution: '', graduationDate: '', gpa: '', coursework: '' }],
            projects: [{ name: '', description: '', technologies: '', link: '', duration: '' }],
            skills: { technical: [], soft: [], languages: [{name: '', proficiency: ''}] }
        };

        // Reset form
        const form = document.getElementById('resume-form');
        if (form) form.reset();

        // Reset dynamic entries
        this.resetDynamicEntries();

        // Go back to landing page
        this.showPage('landing-page');
        
        // Update UI
        this.updateFormStep();
        this.updateProgress();
        this.updatePreview();
    }

    resetDynamicEntries() {
        // Reset education entries
        const educationContainer = document.getElementById('education-entries');
        if (educationContainer) {
            educationContainer.innerHTML = `
                <div class="education-entry">
                    <div class="entry-header">
                        <h4>Education #1</h4>
                        <button type="button" class="btn-remove" onclick="removeEducation(this)"><i class="fas fa-trash"></i></button>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Degree *</label>
                            <input type="text" class="form-control" name="degree" required placeholder="Bachelor of Science in Computer Science">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Institution *</label>
                            <input type="text" class="form-control" name="institution" required placeholder="University Name">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Graduation Date *</label>
                            <input type="month" class="form-control" name="graduationDate" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">GPA</label>
                            <input type="text" class="form-control" name="gpa" placeholder="3.8">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Relevant Coursework</label>
                        <textarea class="form-control" name="coursework" rows="2" placeholder="Data Structures, Algorithms, Web Development..."></textarea>
                    </div>
                </div>
            `;
        }

        // Reset project entries
        const projectsContainer = document.getElementById('projects-entries');
        if (projectsContainer) {
            projectsContainer.innerHTML = `
                <div class="project-entry">
                    <div class="entry-header">
                        <h4>Project #1</h4>
                        <button type="button" class="btn-remove" onclick="removeProject(this)"><i class="fas fa-trash"></i></button>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Project Name *</label>
                            <input type="text" class="form-control" name="name" required placeholder="E-commerce Platform">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Duration</label>
                            <input type="text" class="form-control" name="duration" placeholder="3 months">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Description *</label>
                        <textarea class="form-control" name="description" required rows="3" placeholder="Describe what you built and the impact it had..."></textarea>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Technologies Used *</label>
                            <input type="text" class="form-control" name="technologies" required placeholder="React, Node.js, MongoDB, AWS">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Project Link</label>
                            <input type="url" class="form-control" name="link" placeholder="github.com/username/project">
                        </div>
                    </div>
                </div>
            `;
        }

        // Reset language entries
        const languagesContainer = document.getElementById('languages-entries');
        if (languagesContainer) {
            languagesContainer.innerHTML = `
                <div class="language-entry">
                    <div class="form-row">
                        <div class="form-group">
                            <input type="text" class="form-control" name="languageName" placeholder="English">
                        </div>
                        <div class="form-group">
                            <select class="form-control" name="languageProficiency">
                                <option value="">Select Proficiency</option>
                                <option value="Native">Native</option>
                                <option value="Fluent">Fluent</option>
                                <option value="Advanced">Advanced</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Basic">Basic</option>
                            </select>
                        </div>
                        <button type="button" class="btn-remove" onclick="removeLanguage(this)"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `;
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles if not already added
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 10000;
                    background: var(--color-surface);
                    border: 1px solid var(--color-border);
                    border-radius: var(--radius-base);
                    box-shadow: var(--shadow-lg);
                    padding: 16px;
                    min-width: 300px;
                    animation: slideIn 0.3s ease-out;
                }
                .notification--success { border-color: var(--color-success); }
                .notification--error { border-color: var(--color-error); }
                .notification--info { border-color: var(--color-info); }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: var(--color-text);
                }
                .notification--success .notification-content { color: var(--color-success); }
                .notification--error .notification-content { color: var(--color-error); }
                .notification--info .notification-content { color: var(--color-info); }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .form-control.error {
                    border-color: var(--color-error);
                    box-shadow: 0 0 0 3px rgba(var(--color-error-rgb), 0.1);
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Dynamic Entry Management Functions
function addEducation() {
    const container = document.getElementById('education-entries');
    const entries = container.querySelectorAll('.education-entry');
    const newIndex = entries.length + 1;
    
    const newEntry = document.createElement('div');
    newEntry.className = 'education-entry';
    newEntry.innerHTML = `
        <div class="entry-header">
            <h4>Education #${newIndex}</h4>
            <button type="button" class="btn-remove" onclick="removeEducation(this)"><i class="fas fa-trash"></i></button>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Degree *</label>
                <input type="text" class="form-control" name="degree" required placeholder="Bachelor of Science in Computer Science">
            </div>
            <div class="form-group">
                <label class="form-label">Institution *</label>
                <input type="text" class="form-control" name="institution" required placeholder="University Name">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Graduation Date *</label>
                <input type="month" class="form-control" name="graduationDate" required>
            </div>
            <div class="form-group">
                <label class="form-label">GPA</label>
                <input type="text" class="form-control" name="gpa" placeholder="3.8">
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">Relevant Coursework</label>
            <textarea class="form-control" name="coursework" rows="2" placeholder="Data Structures, Algorithms, Web Development..."></textarea>
        </div>
    `;
    
    container.appendChild(newEntry);
    
    // Add event listeners for new inputs
    newEntry.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', () => window.resumeBuilder.handleFormInput());
        input.addEventListener('change', () => window.resumeBuilder.handleFormInput());
    });
}

function removeEducation(button) {
    const entry = button.closest('.education-entry');
    const container = document.getElementById('education-entries');
    
    if (container.children.length > 1) {
        entry.remove();
        // Update numbering
        const entries = container.querySelectorAll('.education-entry');
        entries.forEach((entry, index) => {
            const header = entry.querySelector('.entry-header h4');
            if (header) {
                header.textContent = `Education #${index + 1}`;
            }
        });
        window.resumeBuilder.handleFormInput();
    }
}

function addProject() {
    const container = document.getElementById('projects-entries');
    const entries = container.querySelectorAll('.project-entry');
    const newIndex = entries.length + 1;
    
    const newEntry = document.createElement('div');
    newEntry.className = 'project-entry';
    newEntry.innerHTML = `
        <div class="entry-header">
            <h4>Project #${newIndex}</h4>
            <button type="button" class="btn-remove" onclick="removeProject(this)"><i class="fas fa-trash"></i></button>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Project Name *</label>
                <input type="text" class="form-control" name="name" required placeholder="E-commerce Platform">
            </div>
            <div class="form-group">
                <label class="form-label">Duration</label>
                <input type="text" class="form-control" name="duration" placeholder="3 months">
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">Description *</label>
            <textarea class="form-control" name="description" required rows="3" placeholder="Describe what you built and the impact it had..."></textarea>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Technologies Used *</label>
                <input type="text" class="form-control" name="technologies" required placeholder="React, Node.js, MongoDB, AWS">
            </div>
            <div class="form-group">
                <label class="form-label">Project Link</label>
                <input type="url" class="form-control" name="link" placeholder="github.com/username/project">
            </div>
        </div>
    `;
    
    container.appendChild(newEntry);
    
    // Add event listeners for new inputs
    newEntry.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', () => window.resumeBuilder.handleFormInput());
        input.addEventListener('change', () => window.resumeBuilder.handleFormInput());
    });
}

function removeProject(button) {
    const entry = button.closest('.project-entry');
    const container = document.getElementById('projects-entries');
    
    if (container.children.length > 1) {
        entry.remove();
        // Update numbering
        const entries = container.querySelectorAll('.project-entry');
        entries.forEach((entry, index) => {
            const header = entry.querySelector('.entry-header h4');
            if (header) {
                header.textContent = `Project #${index + 1}`;
            }
        });
        window.resumeBuilder.handleFormInput();
    }
}

function addLanguage() {
    const container = document.getElementById('languages-entries');
    
    const newEntry = document.createElement('div');
    newEntry.className = 'language-entry';
    newEntry.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <input type="text" class="form-control" name="languageName" placeholder="Language">
            </div>
            <div class="form-group">
                <select class="form-control" name="languageProficiency">
                    <option value="">Select Proficiency</option>
                    <option value="Native">Native</option>
                    <option value="Fluent">Fluent</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Basic">Basic</option>
                </select>
            </div>
            <button type="button" class="btn-remove" onclick="removeLanguage(this)"><i class="fas fa-trash"></i></button>
        </div>
    `;
    
    container.appendChild(newEntry);
    
    // Add event listeners for new inputs
    newEntry.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('input', () => window.resumeBuilder.handleFormInput());
        input.addEventListener('change', () => window.resumeBuilder.handleFormInput());
    });
}

function removeLanguage(button) {
    const entry = button.closest('.language-entry');
    const container = document.getElementById('languages-entries');
    
    if (container.children.length > 1) {
        entry.remove();
        window.resumeBuilder.handleFormInput();
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Resume Builder...');
    window.resumeBuilder = new ResumeBuilder();
});