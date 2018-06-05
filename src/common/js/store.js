export function saveToLocalStore(id, key, value) {
  let store = window.localStorage
  let seller = store[id]
  if (!seller) {
    seller = {}
  } else {
    seller = JSON.parse(store[id])
  }
  seller[key] = value
  store[id] = JSON.stringify(seller);
}

export function readFromLocalStore(id, key, def) {
  let store = window.localStorage
  let sellers = store[id]
  if (!sellers) {
    return def
  }
  let seller = JSON.parse(sellers)
  let oldValue = seller[key]
  if (!oldValue) {
    return def
  }
  return oldValue
}

