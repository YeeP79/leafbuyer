const input = require('./input.js')

const inputData = input.split(/\r?\n/)

const dependencies = inputData.filter(command => command.startsWith('DEPEND '))

const instructions = inputData.filter(command => !command.startsWith('DEPEND '))

const definedDependencies = dependencies.reduce((acc, dep) => {
    console.log(dep)
    const [firstKey, ...rest] = dep.replace('DEPEND ', '').split(' ')
    return {
        ...acc,
        [firstKey]: rest
    }
},{})

let installedApps = []

const install = (app, isDependency) => {
    const dependencies = definedDependencies[app]
    if (dependencies) {
        dependencies.forEach(dep => install(dep, true))
    }
    if (!installedApps.find(appL => app === appL)) {
        installedApps.push(app)
        console.log(`   Installing ${app}`)
    } else {
        if(!isDependency) {
            console.log(`   ${app} is already installed.`)
        }
    }     
}

const remove = (app, isDependency) => {
    //building list of apps that depend on app being removed
    const dependedApps = Object.keys(definedDependencies).reduce((acc, key) => {
      if (definedDependencies[key].includes(app)) {
        return [...acc, key]
      }
      return acc
    }, [])

    //currently installed apps that depend on the application in the current iteration
    const installedDependedApps = installedApps.filter(app => dependedApps.includes(app))
    if (installedDependedApps.length) {
        if(!isDependency) {
            console.log(`   ${app} is still needed.`)
        }
    } else {
        //check to see if app is installed
        const currentlyInstalled = installedApps.find(appL => appL === app)

        if(currentlyInstalled) {
            installedApps = installedApps.filter(appL => appL !== app)
            console.log(`   Removing ${app}`)

            //send dependencies to be removed
            const dependencies = definedDependencies[app]
            if(dependencies) {
                dependencies.forEach(dep => remove(dep, true))
            }
        } else {
            console.log(`   ${app} is not installed.`)
        }
    }
}

const list = () => {
    installedApps.forEach( app => console.log((`    ${app}`)))
}


const runInstructions = () => {
    instructions.forEach(instruction => {
        console.log(instruction)
        if (instruction.startsWith('INSTALL ')) {
            install(instruction.replace('INSTALL ', ''))
        }
        if (instruction.startsWith('LIST')) {
            list()
        }
        if (instruction.startsWith('REMOVE ')) {
            remove(instruction.replace('REMOVE ', ''))
        }
    })
}

runInstructions()