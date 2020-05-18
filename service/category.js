import request from "./network.js"

export function getCategory(){
  return request({
    url: '/category',
  })
}

export function getSubcategory(maitKey) {
  return request({
    url: '/subcategory',
    data: {
      maitKey
    }
  })
}