using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication.Facebook;
using Microsoft.AspNetCore.Authentication.Google;

namespace MerolekiandoBlazor.Controller
{
    [Route("/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        [HttpGet("WebLogin")]
        public async Task<ActionResult> WebLogin(/*string flg*/)
        {

            
            var properties = new AuthenticationProperties {

                RedirectUri = "/"
            };



            return Challenge(properties, FacebookDefaults.AuthenticationScheme);

            //if (flg == "goog")
            //{
            //    return Challenge(properties, GoogleDefaults.AuthenticationScheme);

            //    //await HttpContext.ChallengeAsync(GoogleDefaults.AuthenticationScheme, new AuthenticationProperties()
            //    //{
            //    //    RedirectUri = Url.Action("GoogleResponse")
            //    //});
            //    //return RedirectToAction("GoogleResponse");
            //}
            //else
            //{
            //    return Challenge(properties, FacebookDefaults.AuthenticationScheme);

            //    //await HttpContext.ChallengeAsync(FacebookDefaults.AuthenticationScheme, new AuthenticationProperties()
            //    //{
            //    //    RedirectUri = Url.Action("FacebookResponse")
            //    //});
            //    //return RedirectToAction("FacebookResponse");
            //}
        }
        public async Task<IActionResult> GoogleResponse()
        {
            var result = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            var claim = result.Principal.Identities
                .FirstOrDefault().Claims
                .Select(claim => new
                {
                    claim.Issuer,
                    claim.OriginalIssuer,
                    claim.Type,
                    claim.Value
                }
                );
            //User usr = new();
            //usr.LoginType = "Google";
            //foreach (var item in claim)
            //{
            //    if (item.Type.Contains("/nameidentifier"))
            //    {
            //        usr.UniqueId = item.Value;
            //    }
            //    else if (item.Type.Contains("/name"))
            //    {
            //        usr.Name = item.Value;
            //    }
            //    else if (item.Type.Contains("/emailaddress"))
            //    {
            //        usr.Email = item.Value;
            //    }
            //}
            return RedirectToAction("WebLoginT"/*, usr*/);
        }
        public async Task<IActionResult> FacebookResponse()
        {
            var result = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            var claim = result.Principal.Identities
                .FirstOrDefault().Claims.Select(claim => new
                {
                    claim.Issuer,
                    claim.OriginalIssuer,
                    claim.Type,
                    claim.Value
                });
            //User usr = new();
            //usr.LoginType = "Facebook";
            //foreach (var item in claim)
            //{
            //    if (item.Type.Contains("/nameidentifier"))
            //    {
            //        usr.UniqueId = item.Value;
            //    }
            //    else if (item.Type.Contains("/name"))
            //    {
            //        usr.Name = item.Value;
            //    }

            //}
            return RedirectToAction("WebLoginT"/*, usr*/);
        }
        public async Task<IActionResult> WebLogout()
        {
            HttpContext.Session.Remove("WebUserId");
            await HttpContext.SignOutAsync();
            return RedirectToAction("WebIndex");
        }
        
    }
}
