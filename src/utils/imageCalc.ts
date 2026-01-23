
export async function calculateRatio(background: HTMLImageElement, div: HTMLElement, resolve: (value: number) => void) {
          let percentage : number | undefined = undefined;
          
          if (background.width > background.height) {
              let ratio : number = background.height / background.width;
              if (div.offsetWidth > div.offsetHeight) {
                  let bgW : number = div.offsetWidth;
                  percentage = 100;
                  let bgH : number = Math.round(div.offsetWidth * ratio);
                  if (bgH < div.offsetHeight) {
                      bgH = div.offsetHeight;
                      bgW = Math.round(bgH / ratio);
                      percentage=(100*bgW)/div.offsetWidth;
                  }
              } else {
                  var bgW = Math.round(div.offsetHeight / ratio);
                  percentage=(100*bgW)/div.offsetWidth;
                  bgH = div.offsetHeight;
              }
          } else {
              var ratio = background.width / background.height;
              if (div.offsetHeight > div.offsetWidth) {
                  var bgH = div.offsetHeight;
                  percentage=100;
                  var bgW = Math.round(div.offsetHeight * ratio);
                  if (bgW > div.offsetWidth) {
                      bgW = div.offsetWidth;
                      bgH = Math.round(bgW / ratio);
                      percentage=(100*bgH)/div.offsetHeight;
                  }
              } else {
                  var bgW = Math.round(div.offsetWidth / ratio);
                  var bgH = div.offsetWidth;
                  percentage=100;
              }
          }
          resolve(percentage);
      }