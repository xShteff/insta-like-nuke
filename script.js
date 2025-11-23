(async function () {
  // Constants
  const UNLIKE_BATCH_SIZE = 20
  const DELAY_BETWEEN_ACTIONS_MS = 400 
  const DELAY_BETWEEN_CHECKBOX_CLICKS_MS = 60 

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  const clickElement = async (element) => {
    if (element) {
      element.click()
      console.log('Element clicked')
      await delay(250)
    }
  }

  /**
   * Finds and clicks both Unlike buttons with better targeting
   */
  const findAndClickBothUnlikeButtons = async () => {
    try {
      console.log('Searching for Unlike buttons...')
      
      // Method 1: Find first Unlike button (red span)
      console.log('Looking for first Unlike button (red span)...')
      const redUnlikeSpans = Array.from(document.querySelectorAll('span')).filter(span => 
        span.textContent === 'Unlike' && 
        span.style.color === 'rgb(237, 73, 86)' &&
        span.style.fontWeight === '700'
      )
      
      if (redUnlikeSpans.length > 0) {
        console.log('Found first Unlike button (red span)')
        // Find clickable parent
        let elementToClick = redUnlikeSpans[0]
        let parent = elementToClick.parentElement
        
        while (parent) {
          if (parent.tagName === 'BUTTON' || 
              parent.onclick || 
              parent.getAttribute('onclick') ||
              !parent.style.pointerEvents || 
              parent.style.pointerEvents !== 'none') {
            elementToClick = parent
            break
          }
          parent = parent.parentElement
        }
        
        await clickElement(elementToClick)
        console.log('First Unlike button clicked')
        await delay(700)
      }

      // Method 2: Find second Unlike button (button with specific classes)
      console.log('Looking for second Unlike button (button)...')
      const unlikeButtons = Array.from(document.querySelectorAll('button')).filter(button => {
        const div = button.querySelector('div._ap3a._aacp._aacw._aac-._aad6')
        return div && div.textContent === 'Unlike'
      })
      
      if (unlikeButtons.length > 0) {
        console.log('Found second Unlike button (button)')
        await clickElement(unlikeButtons[0])
        console.log('Second Unlike button clicked')
      } else {
        // Fallback: try div directly
        console.log('Looking for second Unlike button (div)...')
        const unlikeDivs = Array.from(document.querySelectorAll('div._ap3a._aacp._aacw._aac-._aad6')).filter(div => 
          div.textContent === 'Unlike'
        )
        
        if (unlikeDivs.length > 0) {
          console.log('Found second Unlike button (div)')
          await clickElement(unlikeDivs[0])
          console.log('Second Unlike button clicked')
        }
      }

      return true

    } catch (error) {
      console.error('Error clicking Unlike buttons:', error)
      return false
    }
  }

  /**
   * Wait for element by text content
   */
  const waitForElement = async (text, timeout = 8000) => {
    console.log(`Waiting for "${text}"...`)
    const startTime = Date.now()
    
    while (Date.now() - startTime < timeout) {
      const allElements = document.querySelectorAll('*')
      const element = Array.from(allElements).find(el => el.textContent === text)
      if (element) {
        console.log(`Found "${text}"`)
        return element
      }
      await delay(150)
    }
    throw new Error(`"${text}" not found`)
  }

  /**
   * Select and unlike comments
   */
  const unlikeSelectedComments = async () => {
    try {
      console.log('--- Starting to unlike selected comments ---')
      
      await findAndClickBothUnlikeButtons()
      console.log('Unlike process completed for this batch')
      await delay(900)

    } catch (error) {
      console.error('Error in unlikeSelectedComments:', error)
    }
  }

  /**
   * Main function
   */
  const unlikeActivity = async () => {
    try {
      console.log('=== Starting Instagram Unlike Bot ===')
      
      // Click Select button
      const selectButton = await waitForElement('Select', 6000)
      await clickElement(selectButton)
      await delay(600)

      // Find checkboxes
      const checkboxes = document.querySelectorAll('[aria-label="Toggle checkbox"]')
      console.log(`Found ${checkboxes.length} checkboxes`)
      
      if (checkboxes.length === 0) {
        console.log('No checkboxes found - checking if done...')
        const doneButton = await waitForElement('Done', 2500).catch(() => null)
        if (doneButton) {
          await clickElement(doneButton)
          console.log('✅ ALL DONE! Process completed!')
          return
        }
        
        console.log('Retrying...')
        await delay(600)
        return unlikeActivity()
      }

      // Select exactly 20 checkboxes with medium speed
      const countToSelect = Math.min(UNLIKE_BATCH_SIZE, checkboxes.length)
      console.log(`🔘 Selecting ${countToSelect} comments...`)
      
      for (let i = 0; i < countToSelect; i++) {
        checkboxes[i].click()
        await delay(DELAY_BETWEEN_CHECKBOX_CLICKS_MS)
      }

      await delay(500)
      
      // Unlike the selected comments
      await unlikeSelectedComments()
      
      // Continue with next batch
      await delay(1200)
      console.log('🔄 Moving to next batch...')
      unlikeActivity()
      
    } catch (error) {
      console.error('Error:', error)
      await delay(1800)
      unlikeActivity()
    }
  }

  // Start
  try {
    unlikeActivity()
  } catch (error) {
    console.error('Fatal error:', error)
  }
})()
